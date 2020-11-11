import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { ProductDetailsService } from './service/product-details.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public onProductCatalogPage = true;
  public cartCount: number;

  constructor(private router: Router, private pds: ProductDetailsService) {
    this.router.events.subscribe(event => {
			if (event instanceof ActivationEnd) {
        if (event.snapshot && event.snapshot.routeConfig && event.snapshot.routeConfig.path === "checkout") {
          this.onProductCatalogPage = false;
        } else { this.onProductCatalogPage = true; }
			}
		});
  }

  public goToCheckout() {
    if (this.onProductCatalogPage)
      this.onProductCatalogPage = !this.onProductCatalogPage;
      this.router.navigateByUrl('checkout');
  }

  public goToHome() {
    this.router.navigateByUrl('');
  }

  public searchitems(searchValue) {
    this.router.navigate([''], {queryParams: {search: searchValue}})
      .then(() => {
        this.router.navigate([], { queryParams: null})
      })
  }

  public ngOnInit() {
    this.pds.getCartCount.subscribe(value => this.cartCount = value);
  }
}
