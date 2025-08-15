import pool from '../config/db.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const extractPlaylistId = (url) => {
    const regex = /list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const fetchPlaylistVideos = async (playlistUrl) => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
        throw new Error('Invalid Playlist URL');
    }

    let nextPageToken = '';
    const videos = [];

    do {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${process.env.PLAYLIST_API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        data.items.forEach((item) => {
            const videoId = item.snippet.resourceId.videoId;
            const videoTitle = item.snippet.title;
            const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
            videos.push({ title: videoTitle, link: videoLink });
        });

        nextPageToken = data.nextPageToken || '';
    } while (nextPageToken);

    return videos;
};

// 1️⃣ Create Study Plan + Videos
export const plann = async (req, res) => {
    try {
        const { user_id, name, playlistUrl } = req.body;

        if (!user_id || !name || !playlistUrl) {
            return res.status(400).json({ success: false, message: "user_id, name, and playlistUrl are required" });
        }

        // Extract playlist ID
        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) {
            return res.status(400).json({ success: false, message: "Invalid Playlist URL" });
        }

        // Insert into study_plans and get plan ID
        const planInsertQuery = `
            INSERT INTO study_plans (user_id, name, playlist_url, playlist_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const planResult = await pool.query(planInsertQuery, [user_id, name, playlistUrl, playlistId]);
        const studyPlanId = planResult.rows[0].id;

        // Fetch videos from playlist
        const videos = await fetchPlaylistVideos(playlistUrl);

        // Insert videos into study_videos
        const insertQuery = `
            INSERT INTO study_videos (study_plan_id, video_title, video_url)
            VALUES ($1, $2, $3);
        `;
        for (const video of videos) {
            await pool.query(insertQuery, [studyPlanId, video.title, video.link]);
        }

        res.status(201).json({
            success: true,
            message: `Study plan '${name}' created with ${videos.length} videos`,
            studyPlanId,
            videos
        });

    } catch (error) {
        console.error("Error creating study plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2️⃣ Get Study Plan + Videos by playlist_id
export const getPlanByPlaylistId = async (req, res) => {
    try {
        const { playlist_id } = req.params;

        if (!playlist_id) {
            return res.status(400).json({ success: false, message: "playlist_id is required" });
        }

        const query = `
            SELECT sp.id AS study_plan_id, sp.user_id, sp.name, sp.playlist_url, sp.playlist_id,
                   sv.id AS video_id, sv.video_title, sv.video_url, sv.is_completed, sv.notes
            FROM study_plans sp
            JOIN study_videos sv ON sp.id = sv.study_plan_id
            WHERE sp.playlist_id = $1
            ORDER BY sv.id;
        `;

        const result = await pool.query(query, [playlist_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No study plan found for this playlist_id" });
        }

        res.status(200).json({ success: true, data: result.rows });

    } catch (error) {
        console.error("Error fetching plan by playlist_id:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getUserPlaylists = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ success: false, message: "user_id is required" });
        }

        const query = `
            SELECT id AS study_plan_id, name, playlist_id, playlist_url, created_at
            FROM study_plans
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await pool.query(query, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No playlists found for this user" });
        }

        res.status(200).json({
            success: true,
            playlists: result.rows
        });

    } catch (error) {
        console.error("Error fetching playlists for user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3️⃣ Update Video Completion Status
export const updateVideoCompletion = async (req, res) => {
  try {
    const { video_id, is_completed } = req.body;

    if (video_id === undefined || is_completed === undefined) {
      return res.status(400).json({ success: false, message: "video_id and is_completed are required" });
    }

    const updateQuery = `
      UPDATE study_videos
      SET is_completed = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [is_completed, video_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.status(200).json({ success: true, message: "Video status updated", video: result.rows[0] });

  } catch (error) {
    console.error("Error updating video completion:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4️⃣ Update Video Notes
export const updateVideoNotes = async (req, res) => {
  try {
    const { video_id, notes } = req.body;

    if (video_id === undefined || notes === undefined) {
      return res.status(400).json({ success: false, message: "video_id and notes are required" });
    }

    const updateQuery = `
      UPDATE study_videos
      SET notes = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [notes, video_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.status(200).json({ success: true, message: "Notes updated", video: result.rows[0] });

  } catch (error) {
    console.error("Error updating video notes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
