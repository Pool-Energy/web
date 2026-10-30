import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { InfoFaqComponent } from './info-faq.component';

import { PagesModule } from '../pages.module';

describe('InfoFaqComponent', () => {
  let component: InfoFaqComponent;
  let fixture: ComponentFixture<InfoFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [provideTranslateService()],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
