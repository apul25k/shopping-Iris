import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetailsService } from '../../service/product-details.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {
  public productsInCart;
  public totalValue = 0;

  constructor(private pds: ProductDetailsService, private router: Router) { }

  ngOnInit(): void {
    this.productsInCart = this.pds.getProductsInCart();
    if (this.productsInCart) {
      this.productsInCart.forEach(element => {
        this.totalValue += element.price * element.count;
      });
    }
  }

  public addItem(product) {
    if (this.productsInCart) {
      this.productsInCart.forEach(element => {
        if (element.id === product.id) {
          product.count += 1;
          this.totalValue += element.price;
        }
      });
    }
  }

  public removeItem(product) {
    let indexToBeRemoved;
    if (this.productsInCart) {
      this.productsInCart.forEach((element, index) => {
        if (element.id === product.id) {
          product.count -= 1;
          this.totalValue -= element.price;
          if (product.count === 0) indexToBeRemoved = index;
        }
      });
      if (indexToBeRemoved != null && indexToBeRemoved != undefined) this.productsInCart.splice(indexToBeRemoved, 1);
    }
  }

  public checkout() {
    this.pds.clearCart();
    alert("Yay! Congratulations, your order has been placed successfully");
    this.router.navigateByUrl('');
  }

  public goToHome() {
    this.router.navigateByUrl('');
  }
}
