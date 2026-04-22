import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product } from '../services/product';
import { OrderService, Order } from '../services/order';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit, OnDestroy {
  products: Product[] = [];
  orders: Order[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Mock analytics data
  totalSales: number = 12345;
  ordersToday: number = 156;
  activeUsers: number = 2847;
  avgOrderValue: number = 24.50;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.updateAnalytics();
      },
      error: (error) => {
        console.error('Failed to load orders', error);
      }
    });
  }

  updateAnalytics() {
    this.totalSales = this.orders.reduce((sum, order) => sum + order.total, 0);
    this.ordersToday = this.orders.filter(order =>
      new Date(order.createdAt).toDateString() === new Date().toDateString()
    ).length;
    this.avgOrderValue = this.orders.length > 0 ? this.totalSales / this.orders.length : 0;
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (order) => {
        this.loadOrders(); // Reload to update UI
      },
      error: (error) => {
        this.errorMessage = 'Failed to update order status';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
