import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {

  public languages: string[] = ['en', 'fr', 'de', 'es', 'nl', 'tr', 'zh'];

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService
  ) {
    let browserLang: any;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      browserLang = this.translate.getBrowserLang();
    }
    const baseLang: string = (browserLang || 'en').toString().split('-')[0].toLowerCase();
    this.translate.use(this.languages.includes(baseLang) ? baseLang : 'en');
  }

  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }

}
