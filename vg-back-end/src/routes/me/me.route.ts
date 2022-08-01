import express from 'express';
const schemaValidator = require('express-joi-validator');

// Controller
import userController from '../../modules/user/controller/user.controller';

// Schema
import userSchema from '../../modules/user/validations/schemas/user.schema';

const router = express.Router();

router.get(
  '/',
  userController.me,
);

router.put(
  '/',
  schemaValidator(userSchema.updateMe),
  userController.updateMe,
);

export default router;
