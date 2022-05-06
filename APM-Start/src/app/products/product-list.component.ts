import { Component, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, filter, map, Observable } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  selectedCategoryId: number = 1;

  products$: Observable<Product[]> | undefined =
    this.productService.productsWithCategory$.pipe(
      catchError((x) => {
        this.errorMessage = x;
        return EMPTY;
      })
    );

  productsSimpleFilter$ = this.productService.productsWithCategory$.pipe(
    map((x) =>
      x.filter((y) =>
        this.selectedCategoryId
          ? y.categoryId === this.selectedCategoryId
          : true
      )
    )
  );

  categories$ = this.productCategoryService.productCategories$;

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryId = +categoryId;
  }
}
