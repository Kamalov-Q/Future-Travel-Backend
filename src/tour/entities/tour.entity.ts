import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export interface TourInfoItem {
  uz: string;
  ru: string;
}

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ─── O'zbek tili ────────────────────────────────────────────────────────────
  @Column({ length: 200, type: 'varchar' })
  destinationUz: string;

  @Column('text', { nullable: true })
  descriptionUz: string;

  // ─── Rus tili ────────────────────────────────────────────────────────────────
  @Column({ length: 200, type: 'varchar' })
  destinationRu: string;

  @Column('text', { nullable: true })
  descriptionRu: string;

  // ─── Umumiy maydonlar ────────────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Index()
  price: number;

  @Column({ type: 'float', default: 5 })
  rating: number;

  @Column({
    type: "jsonb",
    nullable: false,
    default: () => "'[]'",
  })
  info: TourInfoItem[];

  @Column({ type: 'simple-array', nullable: true })
  imageUrls: string[];

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
