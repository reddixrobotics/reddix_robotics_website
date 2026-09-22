import { Controller, Get, Post, Body, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';

@Controller('api/wishlist')
@UseGuards(UserAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post()
  addToWishlist(
    @Request() req: any,
    @Body() body: { productId: string }
  ) {
    return this.wishlistService.addToWishlist(req.user.id, body.productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }
}
