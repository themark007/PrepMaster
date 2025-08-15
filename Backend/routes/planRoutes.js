import express from 'express';
import { plann , getPlanByPlaylistId ,getUserPlaylists , updateVideoCompletion ,updateVideoNotes } from '../controllers/planController.js';
const router = express.Router();

router.post('/create', plann);
router.get('/view/:playlist_id', getPlanByPlaylistId);

router.get('/playlistid/:user_id', getUserPlaylists);

router.patch('/videos/completion', updateVideoCompletion);

router.patch('/videos/notes', updateVideoNotes);




export default router;