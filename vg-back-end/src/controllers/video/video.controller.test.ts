import SQLite from '../../configs/sqlite.config';
import mockApi from '../../mocks/api.mock';
import videoController from './video.controller';

let request: any;
let response: any;

beforeAll(async() => {
  await SQLite.instance.setup();
});

afterAll(() => {
  SQLite.instance.destroy();
});

describe('Testing video controller', () => {
  beforeEach(() => {
    request = mockApi.mockRequest();
    response = mockApi.mockResponse();
  });

  afterEach(() => {
    request = null;
    response = null;
  });

  test('Create video', async() => {
    request.body = {
      path: 'videos/path/video.mp4',
    };
    await videoController.create(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });

  test('Create incorrect video', async() => {
    await videoController.create(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Get list videos', async() => {
    request.query = {
      limit: 5,
      page: 1,
    };
    await videoController.list(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Get list videos with wrong query params', async() => {
    request.query = null;
    await videoController.list(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Update video', async() => {
    request.body = {
      path: 'videos/path/video.mp4',
    };
    request.params = {
      id: 1,
    };
    await videoController.update(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Update video with wrong data', async() => {
    request.body = null;
    await videoController.update(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Remove video', async() => {
    request.params = {
      id: 1,
    };
    await videoController.remove(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Remove video with wrong data', async() => {
    request.params = null;
    await videoController.remove(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
});
