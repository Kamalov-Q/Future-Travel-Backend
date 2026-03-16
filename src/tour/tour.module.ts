import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { Tour } from './entities/tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService, TypeOrmModule],
})
export class TourModule {}
