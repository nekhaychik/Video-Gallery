// Interfaces
import { IBaseQueryParams, IDeleteById, IDetailById } from 'common.interface';

export interface IBasicVideo {
  id: number;
  path: string;
  authorId: number;
}

export interface ICreateVideo {
  path: string;
  authorId: number;
}

export interface IDetailByPath {
  path: string;
  authorId: number;
}

export interface IDeleteVideoById extends IDeleteById {
  authorId: number;
}

export interface IDetailVideoById extends IDetailById {
  authorId: number;
}

export interface IVideoQueryParams extends IBaseQueryParams {
  authorId: number;
}

export interface IAccessParams {
  id: number;
  authorId: number;
  usersId: number[];
}
