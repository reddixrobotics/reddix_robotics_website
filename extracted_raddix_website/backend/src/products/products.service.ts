import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find products with dynamic filters.
   */
  async findAll(filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: boolean;
  }) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.availability !== undefined) {
      where.availability = filters.availability;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return this.prisma.product.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a single product by ID.
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Create a new product.
   */
  async create(dto: CreateProductDto) {
    // Check if ID already exists
    const existing = await this.prisma.product.findUnique({
      where: { id: dto.id },
    });

    if (existing) {
      throw new ConflictException(`Product with ID ${dto.id} already exists`);
    }

    const { images, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productData,
          technicalSpecifications: productData.technicalSpecifications || undefined,
        },
      });

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((url, index) => ({
            productId: product.id,
            url,
            isPrimary: index === 0, // First image is primary
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { images: true },
      });
    });
  }

  /**
   * Update an existing product.
   */
  async update(id: string, dto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    const { images, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          technicalSpecifications: productData.technicalSpecifications || undefined,
        },
      });

      if (images !== undefined) {
        // Clear existing images and recreate
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url, index) => ({
              productId: id,
              url,
              isPrimary: index === 0,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { images: true },
      });
    });
  }

  /**
   * Delete a product.
   */
  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { success: true, message: `Product ${id} has been deleted.` };
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          `Cannot delete product ${id} because it is referenced by existing orders or other records. Consider marking it as unavailable instead.`
        );
      }
      throw error;
    }
  }
}
