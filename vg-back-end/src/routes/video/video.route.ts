import express from 'express';

// Controller
import videoController from '../../modules/video/controller/video.controller';

// Middleware
import { isAdmin } from '../../middlewares/permission-handler.middleware';
import { multerUploader } from '../../middlewares/video-handler.middleware';
import Video from '../../constants/video';

const router = express.Router();

router.post(
  '/',
  multerUploader.single(Video.VIDEO_UPLOADER_NAME),
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
