import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY, Observable, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = new Subject<string>();
  errorMessage$ = this.errorMessage.asObservable();

  selectedProduct$ = this.productService.selectedProduct$;

  products$: Observable<Product[]> | undefined =
    this.productService.productsWithCategory$.pipe(
      catchError((x) => {
        this.errorMessage.next(x);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) {}

  onSelected(productId: number): void {
    this.productService.changeProduct(productId);
  }
}
