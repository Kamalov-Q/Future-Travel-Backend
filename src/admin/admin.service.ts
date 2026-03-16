import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const name = this.configService.get<string>('ADMIN_NAME', 'Super Admin');

    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed');
      return;
    }

    const existing = await this.adminRepository.findOne({ where: { email } });
    if (existing) {
      this.logger.log(`Admin already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = this.adminRepository.create({ email, password: hashedPassword, name });
    await this.adminRepository.save(admin);
    this.logger.log(`Admin created successfully: ${email}`);
  }

  async findAll() {
    return this.adminRepository.find({
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string) {
    return this.adminRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }
}
