import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
  destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback,
  ): void => {
    callback(null, '/videos');
  },

  filename: (
      request: Request,
      file: Express.Multer.File,
      callback: FileNameCallback,
  ): void => {
    const { originalname } = file;
    callback(null, originalname);
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

export const upload = multer({ fileFilter, storage: fileStorage });
