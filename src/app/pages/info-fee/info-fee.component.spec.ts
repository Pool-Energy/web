import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { InfoFeeComponent } from './info-fee.component';

import { PagesModule } from '../pages.module';

describe('InfoFeeComponent', () => {
  let component: InfoFeeComponent;
  let fixture: ComponentFixture<InfoFeeComponent>;

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
    
    fixture = TestBed.createComponent(InfoFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
