import {
  getRepository,
  DeleteResult,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

// Entities
import { Video } from '../../entities/video/video.entity';

// Utilities
import ApiUtility from '../../utilities/api.utility';
import DateTimeUtility from '../../utilities/date-time.utility';

// Interfaces
import { IBasicVideo, ICreateVideo } from 'video.interface';
import {
  IBaseQueryParams,
  IUpdateById,
  IDeleteById,
  IDetailById,
  IPagination,
} from 'common.interface';

// Errors
import { StringError } from '../../errors/string.error';

async function create(params: ICreateVideo): Promise<Video> {
  const item: Video = new Video();
  item.path = params.path;
  return await getRepository(Video).save(item);
}

async function list(params: IBaseQueryParams): Promise<{ response: Video[], pagination: IPagination }> {
  let videoRepo: SelectQueryBuilder<Video> = getRepository(Video).createQueryBuilder('video');

  // Pagination
  const paginationRepo: SelectQueryBuilder<Video> = videoRepo;
  const total: Video[] = await paginationRepo.getMany();
  const pagination: IPagination = ApiUtility.getPagination(total.length, params.limit, params.page);

  videoRepo = videoRepo.limit(params.limit).offset(ApiUtility.getOffset(params.limit, params.page));
  const videos: Video[] = await videoRepo.getMany();

  const response: Video[] = [];
  if (videos && videos.length) {
    for (const item of videos) {
      response.push(item);
    }
  }
  return { response, pagination };
}

async function getById(params: IDeleteById): Promise<Video> {
  const query: IDetailById = { id: params.id };
  const data: Video = await getRepository(Video).findOne(query);
  return data ? data : null;
}

async function update(params: IBasicVideo): Promise<UpdateResult> {
  const query: IUpdateById = { id: params.id };

  const video: Video = await getRepository(Video).findOne(query);
  if (!video) {
    throw new StringError('Video is not existed');
  }

  return await getRepository(Video).update(query, {
    path: params.path,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}

async function remove(params: IDeleteById): Promise<DeleteResult> {
  const query: IDeleteById = { id: params.id };

  const video: Video = await getRepository(Video).findOne(query);

  if (!video) {
    throw new StringError('Video is not existed');
  }

  return await getRepository(Video).delete(query);
}

export default {
  create,
  list,
  getById,
  update,
  remove,
};
