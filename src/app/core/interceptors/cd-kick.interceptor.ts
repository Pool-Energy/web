import { Injectable, ApplicationRef, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Workaround for an Angular 22 regression affecting NgModule-based apps
 * (standalone: false components): zone.js never enters the "angular" zone
 * after bootstrapModule(), so change detection no longer runs automatically
 * after async work (HTTP responses, WebSocket messages, timers...).
 * See https://github.com/angular/angular/issues/69530
 *
 * Until this is fixed upstream (or the app is migrated to bootstrapApplication),
 * explicitly kick a tick() after every HTTP response so views bound to data
 * fetched over HTTP refresh as expected.
 */
@Injectable()
export class CdKickInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(() => {
        // Defer to the next macrotask: ApplicationRef.tick() throws NG0101
        // ("called recursively") if invoked synchronously while Angular is
        // already mid-tick (e.g. this response was itself handled during
        // another component's change detection pass).
        setTimeout(() => this.injector.get(ApplicationRef).tick(), 0);
      })
    );
  }
}
