import express from 'express';

// Controller
import videoController from '../../controllers/video/video.controller';

// Middleware
import { isAdmin } from '../../middlewares/permission-handler.middleware';

const router = express.Router();

router.post(
  '/',
  videoController.create,
);

router.get(
  '/',
  isAdmin,
  videoController.list,
)

router.get(
  '/my',
  videoController.listMyVideo,
);

router.get(
  '/available',
  videoController.listAvailableVideos,
);

router.put(
  '/:id',
  videoController.update,
);

router.delete(
  '/:id',
  videoController.remove,
);

router.get(
  '/:fileName',
  videoController.getByVideoPath,
);

router.post(
  '/access/:id',
  videoController.addAccess,
);

export default router;
