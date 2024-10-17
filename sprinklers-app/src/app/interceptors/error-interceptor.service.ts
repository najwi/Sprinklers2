import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ErrorInterceptorService {
	private snackBar = inject(MatSnackBar);

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status >= 400 && error.status < 500) {
					this.snackBar.open(
						`Wystąpił błąd API: ${error.status}. Ponów akcję lub odśwież stronę.`,
						'OK',
						{ duration: 15000, panelClass: ['warning-bg'] },
					);
				}
				return throwError(() => error);
			}),
		);
	}
}
