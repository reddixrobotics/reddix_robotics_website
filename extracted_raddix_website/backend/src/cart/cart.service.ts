import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      return await this.prisma.cartItem.findMany({
        where: { userId },
        include: { 
          product: {
            include: { images: true }
          }
        },
      });
    } catch (error) {
      console.error("Cart error:", error);
      throw new InternalServerErrorException('Failed to retrieve cart');
    }
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    if (!productId) {
      throw new NotFoundException('Product ID is required');
    }
    
    try {
      // Verify product exists
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        const updatedItem = await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: { 
            product: {
              include: { images: true }
            }
          },
        });
        
        return {
          success: true,
          message: 'Cart item updated',
          cartItem: updatedItem,
        };
      }

      const cartItem = await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: { 
          product: {
            include: { images: true }
          }
        },
      });
      
      return {
        success: true,
        message: 'Product added to cart',
        cartItem,
      };
    } catch (error) {
      console.error("Cart error:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while adding to cart');
    }
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (!productId) {
      throw new NotFoundException('Product ID is required');
    }
    
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    try {
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (!existingItem) {
        throw new NotFoundException('Cart item not found');
      }

      const updatedItem = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
        include: { 
          product: {
            include: { images: true }
          }
        },
      });
      
      return {
        success: true,
        message: 'Cart item updated',
        cartItem: updatedItem,
      };
    } catch (error) {
      console.error("Cart error:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while updating cart');
    }
  }

  async removeFromCart(userId: string, productId: string) {
    if (!productId) {
      throw new NotFoundException('Product ID is required');
    }
    
    try {
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        await this.prisma.cartItem.delete({
          where: { id: existingItem.id },
        });
      }

      return { success: true, message: 'Product removed from cart' };
    } catch (error) {
      console.error("Cart error:", error);
      throw new InternalServerErrorException('An unexpected error occurred while removing from cart');
    }
  }

  async clearCart(userId: string) {
    try {
      await this.prisma.cartItem.deleteMany({
        where: { userId },
      });
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error("Cart error:", error);
      throw new InternalServerErrorException('An unexpected error occurred while clearing cart');
    }
  }
}
