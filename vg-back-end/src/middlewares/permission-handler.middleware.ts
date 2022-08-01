import express from 'express';
import httpStatusCodes from 'http-status-codes';
import { getRepository } from 'typeorm';

// Interfaces
import IRequest from '../interfaces/IRequest';

// Utilities
import ApiResponse from '../utilities/api-response.utility';

// Entity
import { Role } from '../modules/user/entities/role.entity';

export const isAdmin = () => {
  return async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const role: Role = await getRepository(Role).findOne({ id: req.user.roleId });
    if (role.name !== 'admin') {
      return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
    }
    next();
  };
};
