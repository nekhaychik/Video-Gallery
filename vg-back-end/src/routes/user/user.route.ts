import express from 'express';

// Controller
import userController from '../../modules/user/controller/user.controller';

// Middleware
import { isAdmin } from '../../middlewares/permission-handler.middleware';

const router = express.Router();

/**
 * @swagger
 * /user/:
 *  get:
 *      tags:
 *      - user
 *      summary: Get all users
 *      description:
 *      operationId: getUsers
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 */

router.get(
  '/',
  userController.list,
);

/**
 * @swagger
 * /user/{id}:
 *  put:
 *      tags:
 *      - user
 *      summary: Get user by id
 *      description:
 *      operationId: getUserById
 *      consumes:
 *      - application/json
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: id
 *        in: path
 *        description: user id
 *        required: true
 *        type: string
 *      responses:
 *          200:
 *              description: Success
 */

router.get(
    '/:id',
    userController.detail,
);

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *      tags:
 *      - user
 *      summary: Delete user by id
 *      operationId: deleteUser
 *      produces:
 *          - application/json
 *      parameters:
 *      - name: id
 *        in: path
 *        description: user id
 *        required: true
 *        type: string
 *      responses:
 *          200:
 *              description: Success
 */

router.delete(
  '/:id',
  isAdmin(),
  userController.remove,
);

export default router;
