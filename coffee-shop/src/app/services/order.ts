import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [
    // Mock orders
  ];

  placeOrder(userId: string, items: CartItem[]): Observable<Order> {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const order: Order = {
      id: Date.now().toString(),
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);
    return of(order).pipe(delay(1000)); // Simulate API delay
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const userOrders = this.orders.filter(order => order.userId === userId);
    return of(userOrders).pipe(delay(500));
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(500));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      return of(order).pipe(delay(300));
    }
    throw new Error('Order not found');
  }
}
