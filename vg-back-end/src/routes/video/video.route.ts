import express from 'express';

// Middleware
import { upload } from '../../middlewares/video-handler.middleware';

const router = express.Router();

router.post(
  '/',
  upload.single('video'),
  (req, res) => {
    res.json({ status: 'Saved' });
  },
);

export default router;
