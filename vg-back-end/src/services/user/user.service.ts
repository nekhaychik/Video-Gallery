import {getRepository, SelectQueryBuilder, UpdateResult} from 'typeorm';

// Entities
import { User } from '../../entities/user/user.entity';

// Utilities
import Encryption from '../../utilities/encryption.utility';
import ApiUtility from '../../utilities/api.utility';
import DateTimeUtility from '../../utilities/date-time.utility';

// Interfaces
import {
  IBasicUser,
  ICreateUser,
  ILoginUser,
  IUpdateUser,
  IUserQueryParams,
} from 'user.interface';
import {IDeleteById, IDetailById, IPagination} from 'common.interface';

// Errors
import { StringError } from '../../errors/string.error';

const where: { isDeleted: boolean } = { isDeleted: false };

const create: (params: ICreateUser) => Promise<IBasicUser> = async (params: ICreateUser) => {
  const item: User = new User();
  item.email = params.email;
  item.password = await Encryption.generateHash(params.password, 10);
  item.firstName = params.firstName;
  item.lastName = params.lastName;
  const userData: User = await getRepository(User).save(item);
  return ApiUtility.sanitizeUser(userData);
};

const login: (params: ILoginUser) => Promise<IBasicUser> = async (params: ILoginUser) => {
  const user: User = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email = :email', { email: params.email })
    .select([
      'user.createdAt',
      'user.updatedAt',
      'user.id',
      'user.email',
      'user.password',
      'user.firstName',
      'user.lastName',
      'user.isDeleted',
    ])
    .getOne();

  if (!user) {
    throw new StringError('Your email has not been registered');
  }

  if (await Encryption.verifyHash(params.password, user.password)) {
    return ApiUtility.sanitizeUser(user);
  }

  throw new StringError('Your password is not correct');
};

const getById: (params: IDetailById) => Promise<IBasicUser> = async (params: IDetailById) => {
  try {
    const data: User = await getRepository(User).findOne({ id: params.id });
    return ApiUtility.sanitizeUser(data);
  } catch (e: any) {
    return null;
  }
};

const detail: (params: IDetailById) => Promise<IBasicUser> = async (params: IDetailById) => {
  const query: { isDeleted: boolean, id: number } =  { ...where, id: params.id };

  const user: User = await getRepository(User).findOne(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return ApiUtility.sanitizeUser(user);
}

const update: (params: IUpdateUser) => Promise<UpdateResult> = async (params: IUpdateUser) => {
  const query: { isDeleted: boolean, id: number } = { ...where, id: params.id };

  const user: User = await getRepository(User).findOne(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return await getRepository(User).update(query, {
    firstName: params.firstName,
    lastName: params.lastName,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}

const list: (params: IUserQueryParams) => Promise<{pagination: IPagination, response: IBasicUser[]}> = async (params: IUserQueryParams) => {
  let userRepo: SelectQueryBuilder<User> = getRepository(User).createQueryBuilder('user');
  userRepo = userRepo.where('user.isDeleted = :isDeleted', { isDeleted: false });

  if (params.keyword) {
    userRepo = userRepo.andWhere(
      '(LOWER(user.firstName) LIKE LOWER(:keyword) OR LOWER(user.lastName) LIKE LOWER(:keyword))',
      { keyword: `%${params.keyword}%` },
    );
  }

  // Pagination
  const paginationRepo: SelectQueryBuilder<User> = userRepo;
  const total: User[] = await paginationRepo.getMany();
  const pagRes: { pagination: IPagination } = ApiUtility.getPagination(total.length, params.limit, params.page);

  userRepo = userRepo.limit(params.limit).offset(ApiUtility.getOffset(params.limit, params.page));
  const users: User[] = await userRepo.getMany();

  const response: any[] = [];
  if (users && users.length) {
    for (const item of users) {
      response.push(ApiUtility.sanitizeUser(item));
    }
  }
  return { response, pagination: pagRes.pagination };
};

const remove: (params: IDeleteById) => Promise<UpdateResult> = async (params: IDeleteById) => {
  const query: { isDeleted: boolean, id: number } = { ...where, id: params.id };

  const user: User = await getRepository(User).findOne(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return await getRepository(User).update(query, {
    isDeleted: true,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}

export default {
  create,
  login,
  getById,
  detail,
  update,
  list,
  remove,
}
