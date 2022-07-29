const mockRequest = () => {
  const req: any = {};
  req.body = jest.fn().mockReturnValue(req);
  req.params = jest.fn().mockReturnValue(req);
  return req;
}

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockFileRequest = () => {
  const req: any = {};
  req.body = jest.fn().mockReturnValue(req);
  req.file = jest.fn().mockReturnValue(req);
  req.body = jest.fn().mockReturnValue(req);
  return req;
}

export default {
  mockRequest,
  mockResponse,
  mockFileRequest,
}
