import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  const authReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        localStorage.removeItem('authToken');
        console.error('Unauthorized! Redirect to login');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
