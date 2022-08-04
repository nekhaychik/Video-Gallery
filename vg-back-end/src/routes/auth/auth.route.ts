import express from 'express';
const schemaValidator = require('express-joi-validator');

// Controller
import userController from '../../modules/user/controller/user.controller';

// Schema
import userSchema from '../../modules/user/validations/schemas/user.schema';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *     tags:
 *     - auth
 *     summary: User registration in the system
 *     description:
 *     operationId: register
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *          properties:
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Success
 */

router.post(
  '/register',
  schemaValidator(userSchema.register),
  userController.create,
);

/**
 * @swagger
 * /auth/login:
 *  post:
 *     tags:
 *     - auth
 *     summary: Logs user into the system
 *     description:
 *     operationId: authenticate
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Success
 */

router.post(
  '/login',
  schemaValidator(userSchema.login),
  userController.login,
);

export default router;
