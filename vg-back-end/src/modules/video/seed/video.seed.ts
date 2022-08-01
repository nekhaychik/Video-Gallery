import {DeepPartial, getRepository} from "typeorm";
import {User} from '../../user/entities/user.entity';
import {Video} from '../entity/video.entity';

// @ts-ignore
async function getAuthor(): User {
  return await Promise.resolve(getRepository(User).findOne({ id: 2 }));
}

export const videoSeed: DeepPartial<Video>[] = [
  {
    path: 'videos/path/video.mp4',
    author: getAuthor(),
  },
  {
    path: 'videos/path/animal.mp4',
  },
  {
    path: 'videos/path/nature.mp4',
  },
  {
    path: 'videos/path/sea.mp4',
  },
];
