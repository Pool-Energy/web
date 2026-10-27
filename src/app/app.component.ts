import { Component, ApplicationRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})

export class AppComponent {
  title = 'Pool.Energy';

  constructor(router: Router, appRef: ApplicationRef) {
    // Angular 22 regression workaround (see CdKickInterceptor): without this,
    // the navbar active state (routerLinkActive) and other router-driven
    // bindings stop refreshing after the first navigation.
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => setTimeout(() => appRef.tick(), 0));
  }
}
