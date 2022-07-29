import SQLite from '../../configs/sqlite.config';
import mockApi from '../../mocks/api.mock';
import userController from './user.controller';

let request: any;
let response: any;

beforeAll(async () => {
  await SQLite.instance.setup();
});

afterAll(() => {
  SQLite.instance.destroy();
});

describe('Testing user controller', () => {
  beforeEach(() => {
    request = mockApi.mockRequest();
    response = mockApi.mockResponse();
  });

  afterEach(() => {
    request = null;
    response = null;
  });

  test('Create user', async () => {
    request.body = {
      email: 'admin@gmail.com',
      password: 'password',
      firstName: 'First',
      lastName: 'Last',
    };
    await userController.create(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });

  test('Create duplicated user', async () => {
    request.body = {
      email: 'admin@gmail.com',
      password: 'password',
      firstName: 'First',
      lastName: 'Last',
    };
    await userController.create(request, response);
    expect(response.status).toHaveBeenCalledWith(409);
  });

  test('Create incorrect user', async () => {
    await userController.create(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('User login', async () => {
    request.body = {
      email: 'admin@gmail.com',
      password: 'password',
    };
    await userController.login(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('User login with wrong data', async () => {
    request.body = {
      email: 'fake@gmail.com',
      password: 'password',
    };
    await userController.login(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('User login with empty data', async () => {
    request.body = null;
    await userController.login(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Get current user', async () => {
    request.user = {
      id: 1,
    };
    await userController.me(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Get user detail', async () => {
    request.params = {
      id: 1,
    };
    await userController.detail(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Get user detail with wrong id', async () => {
    request.params = {
      id: 100,
    };
    await userController.detail(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Update user', async () => {
    request.body = {
      firstName: 'First',
      lastName: 'Last',
    };
    request.params = {
      id: 1,
    };
    await userController.update(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Update user with wrong data', async () => {
    request.body = null;
    await userController.update(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Update current user', async () => {
    request.body = {
      firstName: 'First',
      lastName: 'Last',
    };
    request.user = {
      id: 1,
    };
    await userController.updateMe(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Update current user with wrong data', async () => {
    request.body = null;
    await userController.updateMe(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Get list users', async () => {
    request.query = {
      limit: 5,
      page: 1,
    };
    await userController.list(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Get list users with wrong query params', async () => {
    request.query = null;
    await userController.list(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('Remove user', async () => {
    request.params = {
      id: 1,
    };
    await userController.remove(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('Remove wrong user', async () => {
    request.params = null;
    await userController.remove(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
});
