import { describe, it, expect } from 'vitest';
import { ROUTES, buildPath } from '@/routes/routePaths';

describe('Route Definitions and Navigation Builder', () => {
  it('should define core application routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.PORTAL).toBe('/portal');
    expect(ROUTES.ADMIN).toBe('/admin');
    expect(ROUTES.TEACHER).toBe('/teacher');
  });

  it('should build dynamic paths accurately with route parameters', () => {
    const coursePath = buildPath(ROUTES.PORTAL_COURSE, { id: 'ros2-basics' });
    expect(coursePath).toBe('/portal/courses/ros2-basics');

    const productPath = buildPath(ROUTES.PRODUCT_DETAILS, { id: 'robot-arm-v1' });
    expect(productPath).toBe('/products/robot-arm-v1');

    const orderSuccessPath = buildPath(ROUTES.ORDER_SUCCESS, { orderId: 'ord_12345' });
    expect(orderSuccessPath).toBe('/order-success/ord_12345');
  });

  it('should preserve base route when no parameters are provided', () => {
    const homePath = buildPath(ROUTES.HOME);
    expect(homePath).toBe('/');
  });
});
