import { getRepository, SelectQueryBuilder, UpdateResult } from 'typeorm';

// Entities
import { User } from '../entities/user.entity';

// Utilities
import Encryption from '../../../utilities/encryption.utility';
import ApiUtility from '../../../utilities/api.utility';
import DateTimeUtility from '../../../utilities/date-time.utility';

// Interfaces
import {
  IBasicUser,
  ICreateUser,
  ILoginUser,
  IUpdateUser,
  IUserQueryParams,
} from '../interface/user.interface';
import { IDeleteById, IDetailById, IPagination } from 'common.interface';

// Errors
import { StringError } from '../../../errors/string.error';

const WHERE: { isDeleted: boolean } = { isDeleted: false };
const SALT_ROUND_TEN: number = 10;

async function create(params: ICreateUser): Promise<IBasicUser> {
  const item: User = new User();
  item.email = params.email;
  item.password = await Encryption.generateHash(params.password, SALT_ROUND_TEN);
  item.firstName = params.firstName;
  item.lastName = params.lastName;
  const userData: User = await getRepository(User).save(item);
  return ApiUtility.sanitizeUser(userData);
}

async function login(params: ILoginUser): Promise<IBasicUser> {
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
}

async function getById(params: IDetailById): Promise<IBasicUser> {
  try {
    const data: User = await getRepository(User).findOne({ id: params.id });
    return ApiUtility.sanitizeUser(data);
  } catch (e: any) {
    return null;
  }
}

async function detail(params: IDetailById): Promise<IBasicUser> {
  const query: { isDeleted: boolean, id: number } =  { ...WHERE, id: params.id };

  const user: User = await getRepository(User).findOne(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return ApiUtility.sanitizeUser(user);
}

async function update(params: IUpdateUser): Promise<UpdateResult> {
  const query: { isDeleted: boolean, id: number } = { ...WHERE, id: params.id };

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

async function list(params: IUserQueryParams): Promise<{ response: IBasicUser[], pagination: IPagination }> {
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
  const pagination: IPagination = ApiUtility.getPagination(total.length, params.limit, params.page);

  userRepo = userRepo.limit(params.limit).offset(ApiUtility.getOffset(params.limit, params.page));
  const users: User[] = await userRepo.getMany();

  const response: IBasicUser[] = [];
  if (users && users.length) {
    for (const item of users) {
      response.push(ApiUtility.sanitizeUser(item));
    }
  }
  return { response, pagination };
}

async function remove(params: IDeleteById): Promise<UpdateResult> {
  const query: { isDeleted: boolean, id: number } = { ...WHERE, id: params.id };

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
