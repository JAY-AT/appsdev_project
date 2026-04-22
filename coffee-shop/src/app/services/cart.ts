import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveToStorage();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(currentItems);
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItemsSubject.next([...currentItems]);
        this.saveToStorage();
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalItems(): Observable<number> {
    return new Observable(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(total);
      });
    });
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  private saveToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }
}
