import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

// Utilities
import DateTimeUtility from '../utilities/date-time.utility';
import * as path from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
  destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback,
  ): void => {
    callback(null, path.join(__dirname, '/videos/'));
  },

  filename: (
      request: Request,
      file: Express.Multer.File,
      callback: FileNameCallback,
  ): void => {
    const date: string = DateTimeUtility.getCurrentTimeStamp();
    callback(null, `${date}-${file.originalname}`);
  },
});

export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
): void => {
  if (
      file.mimetype === 'video/x-flv' ||
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/quicktime' ||
      file.mimetype === 'video/x-ms-wmv'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }
};

export const multerUploader = multer({ fileFilter, storage: fileStorage });
