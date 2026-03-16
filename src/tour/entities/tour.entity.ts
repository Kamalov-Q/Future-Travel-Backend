import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ─── O'zbek tili ────────────────────────────────────────────────────────────
  @Column({ length: 200, name: 'destination_uz' })
  destinationUz: string;

  @Column({ length: 200, name: 'region_uz' })
  regionUz: string;

  @Column('text', { nullable: true, name: 'description_uz' })
  descriptionUz: string;

  // ─── Rus tili ────────────────────────────────────────────────────────────────
  @Column({ length: 200, name: 'destination_ru' })
  destinationRu: string;

  @Column({ length: 200, name: 'region_ru' })
  regionRu: string;

  @Column('text', { nullable: true, name: 'description_ru' })
  descriptionRu: string;

  // ─── Umumiy maydonlar ────────────────────────────────────────────────────────
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @Column({ nullable: true, length: 500, name: 'image_url' })
  imageUrl: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Comment, (comment) => comment.tour)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
