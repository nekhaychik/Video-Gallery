import express from 'express';

// Controller
import userController from '../../modules/user/controller/user.controller';

// Middleware
import { isAdmin } from '../../middlewares/permission-handler.middleware';

const router = express.Router();

router.get(
  '/',
  userController.list,
);

router.get(
    '/:id',
    userController.detail,
);

router.delete(
  '/:id',
  isAdmin(),
  userController.remove,
);

export default router;
