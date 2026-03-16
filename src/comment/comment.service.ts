import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentStatus } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      status: CommentStatus.PENDING,
    });
    return this.commentRepository.save(comment);
  }

  async findAll(status?: CommentStatus): Promise<Comment[]> {
    const where = status ? { status } : {};
    return this.commentRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['tour'],
    });
  }

  async findByTour(tourId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { tourId, status: CommentStatus.APPROVED },
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment with id ${id} not found`);
    if (comment.status === CommentStatus.APPROVED) {
      throw new BadRequestException('Comment is already approved');
    }
    comment.status = CommentStatus.APPROVED;
    return this.commentRepository.save(comment);
  }

  async reject(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment with id ${id} not found`);
    comment.status = CommentStatus.REJECTED;
    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment with id ${id} not found`);
    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}
