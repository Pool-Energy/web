import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { LayoutsModule } from './layouts/layouts.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { CdKickInterceptor } from './core/interceptors/cd-kick.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    LayoutsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({ prefix: 'assets/i18n/', suffix: '.json' })
    }),
    { provide: HTTP_INTERCEPTORS, useClass: CdKickInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
