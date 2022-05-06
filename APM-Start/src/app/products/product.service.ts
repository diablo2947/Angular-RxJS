import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  private productSelectedAction: BehaviorSubject<number> =
    new BehaviorSubject<number>(1);
  productSelectedAction$: Observable<number> =
    this.productSelectedAction.asObservable();

  private productInsertedAction: Subject<Product> = new Subject<Product>();
  productInsertedAction$ = this.productInsertedAction.asObservable();

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService
  ) {}

  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((data) => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$,
  ]).pipe(
    map(([products, categories]) =>
      products.map(
        (product) =>
          ({
            ...product,
            price: product.price ? product.price * 2 : 0,
            category: categories.find((c) => product.categoryId === c.id)?.name,
            searchKey: [product.productName],
          } as Product)
      )
    )
  );

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$,
  ]).pipe(
    map(([products, selectedProductId]) =>
      products.find((product) => product.id === selectedProductId)
    ),
    tap((product) =>
      console.log(console.log('Product selected:' + JSON.stringify(product)))
    )
  );

  changeProduct(productSelectionId: number): void {
    this.productSelectedAction.next(productSelectionId);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30,
    };
  }

  addProduct(): void {
    this.productInsertedAction.next(this.fakeProduct());
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
