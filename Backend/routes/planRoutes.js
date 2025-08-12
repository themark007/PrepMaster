import express from 'express';
import { plann , getPlanByPlaylistId ,getUserPlaylists} from '../controllers/planController.js';
const router = express.Router();

router.post('/create', plann);
router.post('/view', getPlanByPlaylistId);
router.get('/playlistid', getUserPlaylists);

export default router;