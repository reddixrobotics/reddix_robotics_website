import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Ip,
  Headers,
  ParseBoolPipe,
  ParseFloatPipe,
  Optional,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { CurrentSession } from '../auth/decorators/current-session.decorator';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';

// ─── Public Products Controller ──────────────────────────────────────────────
@Controller('api/products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('availability') availability?: string,
  ) {
    return this.productsService.findAll({
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      availability: availability === 'true' ? true : availability === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}

// ─── Admin Products Controller ───────────────────────────────────────────────
@Controller('api/admin/products')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('availability') availability?: string,
  ) {
    return this.productsService.findAll({
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      availability: availability === 'true' ? true : availability === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const product = await this.productsService.create(createProductDto);
    if (!product) {
      throw new BadRequestException('Product could not be created');
    }
    await this.auditLogService.logAction(
      session.adminId,
      'CREATE_PRODUCT',
      'Product',
      product.id,
      ip,
      userAgent,
    );
    return product;
  }

  @Patch(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    await this.auditLogService.logAction(
      session.adminId,
      'UPDATE_PRODUCT',
      'Product',
      id,
      ip,
      userAgent,
    );
    return product;
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  async remove(
    @Param('id') id: string,
    @CurrentSession() session: SessionData,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.productsService.remove(id);
    await this.auditLogService.logAction(
      session.adminId,
      'DELETE_PRODUCT',
      'Product',
      id,
      ip,
      userAgent,
    );
    return result;
  }
}
