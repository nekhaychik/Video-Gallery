import SQLite from '../../configs/sqlite.config';
import videoService from './video.service';

let video: any;

beforeAll(async() => {
  video = {
    path: 'video/path/video.mp4',
  };
  await SQLite.instance.setup();
});

afterAll(() => {
  SQLite.instance.destroy();
});

describe('Testing video service', () => {
  test('Create video', async() => {
    const result = await videoService.create(video);
    expect(result.id).toBe(1);
    expect(result.path).toBe(video.path);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Get list videos', async() => {
    const result = await videoService.list({
      page: 1,
      limit: 5,
    });
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('pagination');
    expect(Array.isArray(result.response)).toBe(true);
    expect(result.response.length).toBe(1);
  });

  test('Get video by id', async() => {
    const result = await videoService.getById({ id: 1 });
    expect(result.id).toBe(1);
    expect(result.path).toBe('video/path/video.mp4');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  test('Get video by incorrect id', async() => {
    const result = await videoService.getById({ id: 100 });
    expect(result).toBe(null);
  });

  test('Update video', async() => {
    await videoService.update({
      id: 1,
      path: 'videos/newPath/video.mp4',
    });
    const result = await videoService.getById({ id: 1 });
    expect(result.path).toBe('videos/newPath/video.mp4');
  });

  test('Update incorrect video', async () => {
    try {
      await videoService.update({
        id: 100,
        path: 'videos/newPath/video.mp4',
      });
    } catch (error) {
      expect(error.message).toBe('Video is not existed');
    }
  });

  test('Remove video', async () => {
    const result = await videoService.remove({ id: 1 });
    expect(result).toBeDefined();
  });

  test('Remove incorrect video', async () => {
    try {
      await videoService.remove({ id: 100 });
    } catch (error) {
      expect(error.message).toBe('Video is not existed');
    }
  });
});
