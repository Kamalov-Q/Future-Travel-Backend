import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const tour = this.tourRepository.create(createTourDto);
    return this.tourRepository.save(tour);
  }

  async findAll(includeInactive = false): Promise<Tour[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.tourRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!tour) throw new NotFoundException(`Tour with id ${id} not found`);
    return tour;
  }

  async findOneForPublic(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id, isActive: true },
      relations: ['comments'],
    });
    if (!tour) throw new NotFoundException(`Tour with id ${id} not found`);

    // Only return approved comments
    tour.comments = (tour.comments || []).filter((c) => c.status === 'approved');
    return tour;
  }

  async update(id: string, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour with id ${id} not found`);
    Object.assign(tour, updateTourDto);
    return this.tourRepository.save(tour);
  }

  async remove(id: string): Promise<{ message: string }> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour with id ${id} not found`);
    await this.tourRepository.remove(tour);
    return { message: `Tour "${tour.destinationRu} / ${tour.destinationUz}" deleted successfully` };
  }
}
