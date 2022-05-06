import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  catchError,
  combineLatest,
  EMPTY,
  map,
  Observable,
  startWith,
  Subject,
} from 'rxjs';

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
  initialValue: number = 0;

  private categorySelectedIdAction = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedIdAction
    .asObservable()
    .pipe(startWith(this.initialValue));

  products$: Observable<Product[]> | undefined = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$,
  ]).pipe(
    map(([products, categorySelectedId]) => {
      if (!categorySelectedId || categorySelectedId < 0) return products;
      return products.filter(
        (product) => categorySelectedId === product.categoryId
      );
    }),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
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
    this.categorySelectedIdAction.next(+categoryId);
  }
}
