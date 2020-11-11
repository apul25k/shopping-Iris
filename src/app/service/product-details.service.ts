import { Injectable } from '@angular/core';
import { dataService } from '../../assets/data.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  private productsInCart: {
    'id': number,
    'name': string,
    'price': number,
    'selectedCurrency': string,
    'count': number,
    'category': string,
  }[] = [];
  private cartCount$ = new BehaviorSubject<number>(null);
  public getCartCount = this.cartCount$.asObservable();

  constructor() { }

  public getData() {
    return dataService.data;
  }

  public getFilteredDataOnSearch(filterBy: string) {
    return dataService.data.filter(element => element.name.toLowerCase().includes(filterBy.toLowerCase()));
  }

  public addProductInCart(productToBeAdded) {
    let isMatchFound = false;
    if (this.productsInCart) {
      this.productsInCart.forEach(product => {
        if (product.id === productToBeAdded.id) {
          product.count += 1;
          isMatchFound = true;
          return;
        }
      });
    }

    if (!isMatchFound) {
      productToBeAdded['count'] = 1;
      this.productsInCart.push(productToBeAdded);
      this.cartCount$.next(this.productsInCart.length);
    }
  }

  public getProductsInCart() {
    return this.productsInCart;
  }

  public clearCart() {
    this.productsInCart = [];
    this.cartCount$.next(null);
  }
}
