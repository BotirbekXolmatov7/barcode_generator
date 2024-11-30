import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any[] = [];
  constructor(private _appService: AppService, private _router: Router) {}

  ngOnInit(): void {
    this._appService.getAllProducts().subscribe((res: any) => {
      this.products = res.products;
    });
  }
}
