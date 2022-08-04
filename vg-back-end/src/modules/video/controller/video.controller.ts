import httpStatusCodes from 'http-status-codes';
import IRequest from 'IRequest';
import { Response } from 'express';

// Entities
import { Video } from '../../../entities/video/video.entity';

// Interfaces
import IController from 'IController';
import {
  IAccessParams,
  IBasicVideo,
  ICreateVideo,
  IDeleteVideoById,
  IDetailByPath,
  IVideoQueryParams,
} from '../interface/video.interface';
import { IPagination } from 'common.interface';

// Services
import videoService from '../service/video.service';

// Utilities
import ApiResponse from '../../../utilities/api-response.utility';
import ApiUtility from '../../../utilities/api.utility';
import {StringError} from "../../../errors/string.error";

// Constants
const RADIX_TEN: number = 10;

const create: IController = async (req: IRequest, res: Response) => {
  try {

    const file = req.file;
    if (!file) {
      throw new StringError('Please upload a video')
    }
    res.send(file)

    const params: ICreateVideo = {
      path: req.file.path, // req.body.path
      authorId: req.user.id,
    };
    const video: Video = await videoService.create(params);
    return ApiResponse.result(res, video, httpStatusCodes.CREATED);
  } catch (error: any) {
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const list: IController = async (req: IRequest, res: Response) => {
  try {
    const limit: number = ApiUtility.getQueryParam(req, 'limit');
    const page: number = ApiUtility.getQueryParam(req, 'page');
    const authorId: number = req.user.id;
    const params: IVideoQueryParams = { limit, page, authorId };
    const data: { pagination: IPagination, response: Video[] } = await videoService.list(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null, data.pagination);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
}

const listMyVideo: IController = async (req: IRequest, res: Response) => {
  try {
    const limit: number = ApiUtility.getQueryParam(req, 'limit');
    const page: number = ApiUtility.getQueryParam(req, 'page');
    const authorId: number = req.user.id;
    const params: IVideoQueryParams = { limit, page, authorId };
    const data: { pagination: IPagination, response: Video[] } = await videoService.listMyVideo(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null, data.pagination);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

const listAvailableVideos: IController = async (req: IRequest, res: Response) => {
  try {
    const limit: number = ApiUtility.getQueryParam(req, 'limit');
    const page: number = ApiUtility.getQueryParam(req, 'page');
    const authorId: number = req.user.id;
    const params: IVideoQueryParams = { limit, page, authorId };
    const data: { pagination: IPagination, response: Video[] } = await videoService.listAvailableVideo(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null, data.pagination);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
}

const update: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IBasicVideo = {
      path: req.body.path,
      id: parseInt(req.params.id, RADIX_TEN),
      authorId: req.user.id,
    };
    await videoService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

const addAccess: IController = async (req: IRequest, res: Response) => {
  try {
    const usersId: number[] = [];
    req.body.usersId.forEach((id: string) => {
      usersId.push(parseInt(id, RADIX_TEN));
    });
    const params: IAccessParams = {
      usersId,
      id: parseInt(req.params.id, RADIX_TEN),
      authorId: req.user.id,
    };
    await videoService.addAccess(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
}

const remove: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IDeleteVideoById = {
      id: parseInt(req.params.id, RADIX_TEN),
      authorId: req.user.id,
    };
    await videoService.remove(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

const getByVideoPath: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IDetailByPath = {
      path: req.body.path,
      authorId: req.user.id,
    };
    await videoService.getByPath(params);
    await res.sendFile(params.path);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
}

export default {
  create,
  list,
  listMyVideo,
  listAvailableVideos,
  update,
  addAccess,
  remove,
  getByVideoPath,
};
