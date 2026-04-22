import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'soda' | 'food' | 'dessert';
  image: string;
  rating: number;
  inStock: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Premium Espresso',
      description: 'Rich, bold, and perfectly brewed espresso',
      price: 4.50,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3',
      rating: 4.8,
      inStock: true,
    },
    {
      id: '2',
      name: 'Craft Lemonade',
      description: 'Refreshing and naturally sweet',
      price: 3.50,
      category: 'soda',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3',
      rating: 4.5,
      inStock: true,
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      description: 'Decadent and irresistible',
      price: 6.00,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3',
      rating: 4.9,
      inStock: true,
    },
    {
      id: '4',
      name: 'Avocado Toast',
      description: 'Healthy and delicious',
      price: 8.50,
      category: 'food',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3',
      rating: 4.6,
      inStock: true,
    },
    // Add more products as needed
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(500)); // Simulate API delay
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }

  filterByCategory(category: string): Observable<Product[]> {
    if (category === 'all') {
      return this.getProducts();
    }
    const filtered = this.products.filter(p => p.category === category);
    return of(filtered).pipe(delay(300));
  }

  getCategories(): string[] {
    return ['all', 'coffee', 'soda', 'food', 'dessert'];
  }
}
