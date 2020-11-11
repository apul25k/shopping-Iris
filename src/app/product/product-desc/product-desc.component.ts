import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { ProductDetailsService } from '../../service/product-details.service';

@Component({
  selector: 'app-product-desc',
  templateUrl: './product-desc.component.html',
  styleUrls: ['./product-desc.component.css']
})
export class ProductDescComponent implements OnInit {
  public cartItemsCount = 10;
  sortForm: FormGroup;
  sortByOptions = [
    {name: 'Sort by name Asc', value: 0},
    {name: 'Sort by name Desc', value: 1},
    {name: 'Sort by Price HTL', value: 2},
    {name: 'Sort by Price LTH', value: 3},
  ];
  public categoryOptions = ['Show All'];
  public currencyOptions = [ {value: 'INR', name: 'Indian Rupee', wrtRupee: 1},
  {value: 'EUR', name: 'Euro', wrtRupee: .013},
  {value: 'USD', name: 'US Dollar', wrtRupee: .0153},
];

  constructor(private fb: FormBuilder, private pds: ProductDetailsService, private router: Router) {
    let params;
    this.router.events.subscribe(event => {
			if (event instanceof ActivationEnd) {
        params = (event.snapshot && event.snapshot.queryParams);
      }
      if (event instanceof NavigationEnd && params.search) {
				this.getFilteredProducts(params);
			}
		});
  }
  public products;
  public productsOrigin;

  ngOnInit(): void {
    this.sortForm = this.fb.group({
      sortDropdown: [''],
      categoryDropdown: [''],
    });

    this.productsOrigin = this.pds.getData();
    this.products = JSON.parse(JSON.stringify(this.productsOrigin));

    const categoryOptionsTemp = this.products.map(product => product.category)
                              .filter((val, ind, arr) => ind === arr.indexOf(val));
    this.categoryOptions = this.categoryOptions.concat(categoryOptionsTemp);

    this.sortForm.get('sortDropdown').valueChanges.subscribe(value => {
      switch (+value) {
        case 0:
          this.products.sort((a, b) => {
            if (a.name.toUpperCase() > b.name.toUpperCase()) {
              return 1;
            }
            if (a.name.toUpperCase() < b.name.toUpperCase()) {
              return -1;
            }
            return 0;
          });
          break;
        case 1:
          this.products.sort((a, b) => {
            if (b.name.toUpperCase() > a.name.toUpperCase()) {
              return 1;
            }
            if (b.name.toUpperCase() < a.name.toUpperCase()) {
              return -1;
            }
            return 0;
          });
          break;
        case 2:
          this.products.sort((a, b) => {
            return b.price - a.price;
          });
          break;
        case 3:
          this.products.sort((a, b) => {
            return a.price - b.price;
          });
          break;
      }
    });

    this.sortForm.get('categoryDropdown').valueChanges.subscribe(value => {
      if (value === 'Show All') {
        this.products = JSON.parse(JSON.stringify(this.productsOrigin));
      } else {
        this.products = this.productsOrigin.filter(product => product.category === value);
      }
    });
  }

  public getFilteredProducts(params) {
    if (this.sortForm) this.sortForm.get('sortDropdown').reset();
    this.products = this.pds.getFilteredDataOnSearch(params.search);
  }

  public addItemToCart(item) {
    this.pds.addProductInCart(item);
  }

  public applyPriceFilter(event) {
    if (this.products) {
      this.products = this.pds.getData()
        .filter(element => element.price >= event[0] && element.price <= event[1]);
    }
  }

  public changeInCurrency (value, product) {
    const respectiveProduct = this.products.find(pd => pd.id === product.id);
    const wrtValue = this.currencyOptions.filter(option => option.value === value).map(x => x.wrtRupee)[0];
    respectiveProduct.price = (respectiveProduct.price * wrtValue).toFixed(2);
    respectiveProduct.selectedCurrency = value;
  }

}
