import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductDescComponent } from './product/product-desc/product-desc.component';
import { ProductCheckoutComponent } from './product/product-checkout/product-checkout.component';

const routes: Routes = [
  { path: 'checkout', component: ProductCheckoutComponent },
  { path: '', component: ProductDescComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ProductDescComponent,
    ProductCheckoutComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
