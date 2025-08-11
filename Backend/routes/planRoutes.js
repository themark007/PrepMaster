import express from 'express';
import { plann , getPlanByPlaylistId} from '../controllers/planController.js';
const router = express.Router();

router.post('/create', plann);
router.post('/view', plann);

export default router;