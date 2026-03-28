import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tour } from "./entities/tour.entity";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { CreateTourDto } from "./dto/create-tour.dto";
import { QueryTourDto } from "./dto/query-tour.dto";
import { PaginatedResponse } from "src/interfaces/paginated-response.interface";
import { UpdateTourDto } from "./dto/update-tour.dto";


@Injectable()
export class TourService {
    constructor(
        @InjectRepository(Tour)
        private readonly tourRepository: Repository<Tour>,
    ) { }

    async create(dto: CreateTourDto): Promise<Tour> {
        const tour = this.tourRepository.create({
            ...dto,
            rating: dto.rating ?? 5,
            info: dto?.info ?? [],
            imageUrls: dto.imageUrls ?? [],
            isActive: dto.isActive ?? true
        });

        return this.tourRepository.save(tour);
    }

    async findAll(dto: QueryTourDto, isAdmin = false): Promise<PaginatedResponse<Tour>> {

        const { page = 1, limit = 10, search, minPrice, maxPrice } = dto;

        const safeLimit = Math.min(limit, 100);
        const skip = (page - 1) * safeLimit;

        const qb = this.tourRepository.createQueryBuilder('tour');

        this.applyFilters(qb, {
            search, minPrice, maxPrice
        });

        qb.skip(skip).take(safeLimit);

        const [items, totalItems] = await qb.getManyAndCount();
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 1;

        return {
            items, 
            meta: {
                totalItems, 
                totalPages,
                itemCount: items.length,
                itemsPerPage: safeLimit, 
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        }

    }

    private applyFilters(
        qb: SelectQueryBuilder<Tour>,
        filters: {
            search?: string;
            minPrice?: number;
            maxPrice?: number;
        },
    ): void {
        const { search, minPrice, maxPrice } = filters;

        if (search) {
            const pattern = `%${search}%`;
            qb.andWhere(
                new Brackets((subQ) => {
                    subQ
                        .where('tour.destinationUz ILIKE :search', { search: pattern })
                        .orWhere('tour.destinationRu ILIKE :search', { search: pattern })
                        .orWhere('tour.descriptionUz ILIKE :search', { search: pattern })
                        .orWhere('tour.descriptionRu ILIKE :search', { search: pattern });
                }),
            );
        }

        if (typeof minPrice === 'number') {
            qb.andWhere('tour.price >= :minPrice', { minPrice });
        }

        if (typeof maxPrice === 'number') {
            qb.andWhere('tour.price <= :maxPrice', { maxPrice });
        }
    }

    async findOne(id: string): Promise<Tour> {
        const tour = await this.tourRepository.findOne({
            where: {id},
        });

        if (!tour) {
            throw new NotFoundException(`Tour with id ${id} not found`);
        }

        return tour;
    }

    async update(id: string, dto: UpdateTourDto): Promise<Tour> {
        const tour = await this.tourRepository.findOne({
            where: {id},
        });

        if (!tour) {
            throw new NotFoundException(`Tour with id ${id} not found`);
        }

        Object.assign(tour, dto);

        return this.tourRepository.save(tour);

    }

    async remove(id: string): Promise<{message: string}> {
        const tour = await this.tourRepository.findOne({
            where: {id},
        });

        if (!tour) {
            throw new NotFoundException(`Tour with id ${id} not found`);
        }

        await this.tourRepository.remove(tour);

        return {
            message: `Tour "${tour.destinationRu} / ${tour.destinationUz}" deleted successfully`
        }
    }
}