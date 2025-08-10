import express from 'express';
import { signup , login ,googleAuth , googleCallback} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);


export default router;