import { Controller, Get, Post, Body, Delete, Param, Put, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';

@Controller('api/cart')
@UseGuards(UserAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addToCart(
    @Request() req: any,
    @Body() body: { productId: string; quantity: number }
  ) {
    return this.cartService.addToCart(req.user.id, body.productId, body.quantity || 1);
  }

  @Put(':productId')
  updateQuantity(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }
  ) {
    return this.cartService.updateQuantity(req.user.id, productId, body.quantity);
  }

  @Delete(':productId')
  removeFromCart(@Request() req: any, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
