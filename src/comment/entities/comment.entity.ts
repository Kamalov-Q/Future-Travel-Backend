import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tour } from '../../tour/entities/tour.entity';

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING,
  })
  status: CommentStatus;

  @Column({ name: 'tour_id' })
  tourId: string;

  @ManyToOne(() => Tour, (tour) => tour.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
