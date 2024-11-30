import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BarcodeGeneratorComponent } from './barcode-generator/barcode-generator.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'barcode/:id', component: BarcodeGeneratorComponent},
];
