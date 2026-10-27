import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Angular 22 regression workaround (NgModule-based apps with standalone:false
// components stop auto-updating the view after async events - zone.js never
// enters the "angular" zone). Confirmed fix: https://github.com/angular/angular/issues/69530
platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })],
})
  .catch(err => console.error(err));
