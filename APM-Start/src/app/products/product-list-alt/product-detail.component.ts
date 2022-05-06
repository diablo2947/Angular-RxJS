import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, map, Observable, Subject, tap } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = new Subject<string>();
  errorMessage$ = this.errorMessage.asObservable();

  product$: Observable<Product | undefined> =
    this.productService.selectedProduct$.pipe(
      catchError((err) => {
        this.errorMessage.next(err);
        return EMPTY;
      })
    );

  productSuppliers: Supplier[] | null = null;

  constructor(private productService: ProductService) {}
}
