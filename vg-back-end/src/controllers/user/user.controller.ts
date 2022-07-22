import httpStatusCodes from 'http-status-codes';

// Interfaces
import IController from '../../interfaces/IController';
import {
  IBasicUser,
  ICreateUser,
  ILoginUser,
  IUpdateUser, IUserQueryParams,
} from 'user.interface';
import { ICookie, IDeleteById, IDetailById, IPagination } from 'common.interface';

// Errors
import { StringError } from '../../errors/string.error';

// Services
import userService from '../../services/user/user.service';

// Utilities
import ApiResponse from '../../utilities/api-response.utility';
import Encryption from '../../utilities/encryption.utility';
import ApiUtility from '../../utilities/api.utility';
import IRequest from 'IRequest';
import { Response } from 'express';

// Constants
import constants from '../../constants';
const RADIX_TEN: number = 10;

const create: IController = async (req: IRequest, res: Response) => {
  try {
    const params: ICreateUser = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
    const user: IBasicUser = await userService.create(params);
    return ApiResponse.result(res, user, httpStatusCodes.CREATED);
  } catch (e: any) {
    if (e.code === constants.ERROR_CODE.DUPLICATED || e.code === constants.ERROR_CODE.SQLITE_DUPLICATED) {
      return ApiResponse.error(res, httpStatusCodes.CONFLICT, 'Email already exists.');
    }
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const login: IController = async (req: IRequest, res: Response) => {
  try {
    const params: ILoginUser = {
      email: req.body.email,
      password: req.body.password,
    }
    const user: IBasicUser = await userService.login(params);
    const cookie: ICookie = await generateUserCookie(user.id);
    return ApiResponse.result(res, user, httpStatusCodes.OK, cookie);
  } catch (e: any) {
    if (e instanceof StringError) {
      return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
    }
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, 'Something went wrong');
  }
};

const me: IController = async (req: IRequest, res: Response) => {
  const cookie: ICookie = await generateUserCookie(req.user.id);
  return ApiResponse.result(res, req.user, httpStatusCodes.OK, cookie);
};

const detail: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IDetailById = {
      id: parseInt(req.params.id, RADIX_TEN),
    }
    const data: IBasicUser = await userService.detail(params);
    return ApiResponse.result(res, data, httpStatusCodes.OK);
  } catch (e: any) {
    ApiResponse.exception(res, e);
  }
};

const update: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IUpdateUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      id: parseInt(req.params.id, RADIX_TEN),
    }
    await userService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e: any) {
    ApiResponse.exception(res, e);
  }
};

const updateMe: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IUpdateUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      id: req.user.id,
    }
    await userService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e: any) {
    ApiResponse.exception(res, e);
  }
};

const list: IController = async (req: IRequest, res: Response) => {
  try {
    const limit: number = ApiUtility.getQueryParam(req, 'limit');
    const page: number = ApiUtility.getQueryParam(req, 'page') ;
    const keyword: string = ApiUtility.getQueryParam(req, 'keyword');
    const params: IUserQueryParams = { limit, page, keyword };
    const data: { pagination: IPagination, response: IBasicUser[] } = await userService.list(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null, data.pagination);
  } catch (e: any) {
    ApiResponse.exception(res, e);
  }
};

const remove: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IDeleteById = {
      id: parseInt(req.params.id, RADIX_TEN),
    }
    await userService.remove(params);
    return  ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e: any) {
    ApiResponse.exception(res, e);
  }
};

const generateUserCookie: (userId: number) => Promise<ICookie> = async (userId: number) => {
  return {
    key: constants.COOKIE.COOKIE_USER,
    value: Encryption.generateCookie(constants.COOKIE.KEY_USER_ID, userId.toString()),
  };
};

export default {
  create,
  login,
  me,
  detail,
  update,
  updateMe,
  list,
  remove,
};
