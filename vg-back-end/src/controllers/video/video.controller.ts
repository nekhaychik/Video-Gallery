import httpStatusCodes from 'http-status-codes';
import IRequest from 'IRequest';
import { Response } from 'express';

// Entities
import { Video } from '../../entities/video/video.entity';

// Interfaces
import IController from '../../interfaces/IController';
import { IBasicVideo } from 'video.interface';
import { IBaseQueryParams, IDeleteById, IPagination } from 'common.interface';

// Services
import videoService from '../../services/video/video.service';

// Utilities
import ApiResponse from '../../utilities/api-response.utility';
import ApiUtility from '../../utilities/api.utility';

// Constants
const RADIX_TEN: number = 10;

const create: IController = async (req: IRequest, res: Response) => {
  try {
    const params = {
      path: req.body.path,
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
    const params: IBaseQueryParams = { limit, page };
    const data: { pagination: IPagination, response: Video[] } = await videoService.list(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null, data.pagination);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

const update: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IBasicVideo = {
      path: req.body.path,
      id: parseInt(req.params.id, RADIX_TEN),
    };
    await videoService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

const remove: IController = async (req: IRequest, res: Response) => {
  try {
    const params: IDeleteById = {
      id: parseInt(req.params.id, RADIX_TEN),
    };
    await videoService.remove(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (error: any) {
    ApiResponse.exception(res, error);
  }
};

export default {
  create,
  list,
  update,
  remove,
};
