import { Entity, PrimaryColumn } from 'typeorm';

@Entity('video_user', {})
export class VideoUser {

  @PrimaryColumn({ type: 'int' })
  videoId: number;

  @PrimaryColumn({ type: 'int' })
  userId: number;

}
