import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    try {
      return await this.prisma.wishlistItem.findMany({
        where: { userId },
        include: { 
          product: {
            include: { images: true }
          }
        },
      });
    } catch (error) {
      console.error("Wishlist error:", error);
      throw new InternalServerErrorException('Failed to retrieve wishlist');
    }
  }

  async addToWishlist(userId: string, productId: string) {
    if (!productId) {
      throw new NotFoundException('Product ID is required');
    }

    try {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const existingItem = await this.prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        return {
          success: true,
          message: 'Product already exists in wishlist',
          wishlistItem: existingItem,
        };
      }

      const wishlistItem = await this.prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
        include: { 
          product: {
            include: { images: true }
          }
        },
      });

      return {
        success: true,
        message: 'Product added to wishlist',
        wishlistItem,
      };
    } catch (error) {
      console.error("Wishlist error:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while adding to wishlist');
    }
  }

  async removeFromWishlist(userId: string, productId: string) {
    if (!productId) {
      throw new NotFoundException('Product ID is required');
    }

    try {
      const existingItem = await this.prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        await this.prisma.wishlistItem.delete({
          where: { id: existingItem.id },
        });
      }

      return { success: true, message: 'Product removed from wishlist' };
    } catch (error) {
      console.error("Wishlist error:", error);
      throw new InternalServerErrorException('An unexpected error occurred while removing from wishlist');
    }
  }
}
