import {
  getRepository,
  DeleteResult,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

// Entities
import { Video } from '../entity/video.entity';
import { User } from '../../user/entities/user.entity';
import { VideoUser } from '../../../entities/video_user/video_user.entity';

// Utilities
import ApiUtility from '../../../utilities/api.utility';
import DateTimeUtility from '../../../utilities/date-time.utility';

// Interfaces
import {
  IAccessParams,
  IBasicVideo,
  ICreateVideo,
  IDeleteVideoById,
  IDetailByPath,
  IDetailVideoById,
  IVideoQueryParams,
} from '../interface/video.interface';
import {
  IUpdateById,
  IDeleteById,
  IDetailById,
  IPagination,
} from 'common.interface';

// Errors
import { StringError } from '../../../errors/string.error';

async function create(params: ICreateVideo): Promise<Video> {
  const item: Video = new Video();
  item.path = params.path;
  item.author = await getRepository(User).findOne({ id: params.authorId });
  return await getRepository(Video).save(item);
}

async function createVideoPagination(params: IVideoQueryParams, repo: SelectQueryBuilder<Video>) {
  let videoRepo: SelectQueryBuilder<Video> = repo;

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

async function list(params: IVideoQueryParams): Promise<{ response: Video[], pagination: IPagination }> {
  const videoRepo: SelectQueryBuilder<Video> = getRepository(Video).createQueryBuilder('video');

  return createVideoPagination(params, videoRepo);
}

async function listMyVideo(params: IVideoQueryParams): Promise<{ response: Video[], pagination: IPagination }> {
  let videoRepo: SelectQueryBuilder<Video> = getRepository(Video).createQueryBuilder('video');
  videoRepo = videoRepo.where('video.authorId = :authorId', { authorId: params.authorId });

  return createVideoPagination(params, videoRepo);
}

async function listAvailableVideo(params: IVideoQueryParams): Promise<{ response: Video[], pagination: IPagination }> {
  let access: SelectQueryBuilder<VideoUser> = getRepository(VideoUser).createQueryBuilder('access');
  access = access.where('access.userId = :userId', { userId: params.authorId });

  const accessRepo: VideoUser[] = await access.getMany();
  const videosId: number[] = [];
  accessRepo.forEach((access) => {
    videosId.push(access.videoId);
  });

  let videoRepo = getRepository(Video).createQueryBuilder('video');
  videoRepo = videoRepo.where('id IN (:videosId)', { videosId });

  return createVideoPagination(params, videoRepo);
}

async function getById(params: IDetailVideoById): Promise<Video> {
  const query: IDetailById = { id: params.id };
  const data: Video = await getRepository(Video).findOne(query);
  return data && data.authorId === params.authorId ? data : null;
}

async function getByPath(params: IDetailByPath): Promise<Video> {
  const query: { path: string } = { path: params.path };
  const data: Video = await getRepository(Video).findOne(query);
  return data && data.authorId === params.authorId ? data : null;
}

async function update(params: IBasicVideo): Promise<UpdateResult> {
  const query: IUpdateById = { id: params.id };

  const video: Video = await getRepository(Video).findOne(query);

  if (video && video.authorId !== params.authorId) {
    throw new StringError('You do not have access to the video');
  }

  if (!video) {
    throw new StringError('Video is not existed');
  }

  return await getRepository(Video).update(query, {
    path: params.path,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}

async function addAccess(params: IAccessParams): Promise<VideoUser[]> {
  const query = { id: params.id };

  const video: Video = await getRepository(Video).findOne(query);
  const response: VideoUser[] = [];

  if (video.authorId !== params.authorId) {
    throw new StringError('You do not have access to the video');
  }

  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < params.usersId.length; i++) {
    const access: VideoUser = { videoId: video.id, userId: params.usersId[i] };
    await getRepository(VideoUser).save(access);
    response.push(access);
  }

  return response;
}

async function remove(params: IDeleteVideoById): Promise<DeleteResult> {
  const query: IDeleteById = { id: params.id };

  const video: Video = await getRepository(Video).findOne(query);

  if (video && video.authorId !== params.authorId) {
    throw new StringError('You are not an author. You cannot remove the video');
  }

  if (!video) {
    throw new StringError('Video is not existed');
  }

  return await getRepository(Video).delete(query);
}

export default {
  create,
  list,
  listMyVideo,
  listAvailableVideo,
  getById,
  getByPath,
  update,
  addAccess,
  remove,
};
