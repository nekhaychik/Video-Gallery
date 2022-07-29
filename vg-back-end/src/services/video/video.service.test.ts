import SQLite from '../../configs/sqlite.config';

// Services
import videoService from './video.service';
import userService from '../user/user.service';

let video: any;
let user: any;

beforeAll(async() => {
  video = {
    path: 'video/path/video.mp4',
    authorId: 1,
  };
  await SQLite.instance.setup();
  user = {
    firstName: 'Test',
    lastName: 'Test',
    password: 'password',
    email: 'test@email.com',
  };
  await userService.create(user);
});

afterAll(() => {
  SQLite.instance.destroy();
});

describe('Testing video service', () => {
  test('Create video', async() => {
    const result = await videoService.create(video);
    expect(result.id).toBe(1);
    expect(result.path).toBe(video.path);
    expect(result.authorId).toBe(1);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Get my videos list', async() => {
    const result = await videoService.listMyVideo({
      page: 1,
      limit: 5,
      authorId: 1,
    });
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('pagination');
    expect(Array.isArray(result.response)).toBe(true);
    expect(result.response.length).toBe(1);
  });

  test('Get not my list video', async() => {
    const result = await videoService.listMyVideo({
      page: 1,
      limit: 5,
      authorId: 100,
    });
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('pagination');
    expect(Array.isArray(result.response)).toBe(true);
    expect(result.response.length).toBe(0);
  });

  test('Get video by id', async() => {
    const result = await videoService.getById({ id: 1, authorId: 1 });
    expect(result.id).toBe(1);
    expect(result.path).toBe('video/path/video.mp4');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Get video by incorrect id', async() => {
    const result = await videoService.getById({ id: 100, authorId: 1 });
    expect(result).toBe(null);
  });

  test('Get video by path', async() => {
    const result = await videoService.getByPath({ path: 'video/path/video.mp4', authorId: 1 });
    expect(result.id).toBe(1);
    expect(result.path).toBe('video/path/video.mp4');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Get video by incorrect path', async() => {
    const result = await videoService.getByPath({ path: '', authorId: 1 });
    expect(result).toBe(null);
  });

  test('Update video', async() => {
    await videoService.update({
      id: 1,
      path: 'videos/newPath/video.mp4',
      authorId: 1,
    });
    const result = await videoService.getById({ id: 1, authorId: 1 });
    expect(result.path).toBe('videos/newPath/video.mp4');
  });

  test('Update incorrect video', async () => {
    try {
      await videoService.update({
        id: 100,
        path: 'videos/newPath/video.mp4',
        authorId: 1,
      });
    } catch (error) {
      expect(error.message).toBe('Video is not existed');
    }
  });

  test('Remove video', async () => {
    const result = await videoService.remove({ id: 1, authorId: 1 });
    expect(result).toBeDefined();
  });

  test('Remove incorrect video', async () => {
    try {
      await videoService.remove({ id: 100, authorId: 1 });
    } catch (error) {
      expect(error.message).toBe('Video is not existed');
    }
  });
});
