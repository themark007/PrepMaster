import express from 'express';
import { plann , getPlanByPlaylistId ,getUserPlaylists} from '../controllers/planController.js';
const router = express.Router();

router.post('/create', plann);
router.get('/view/:playlist_id', getPlanByPlaylistId);

router.get('/playlistid/:user_id', getUserPlaylists);


export default router;