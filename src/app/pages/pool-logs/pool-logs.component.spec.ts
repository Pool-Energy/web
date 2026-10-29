import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PoolLogsComponent } from './pool-logs.component';

import { PagesModule } from '../pages.module';

describe('PoolStatsComponent', () => {
  let component: PoolLogsComponent;
  let fixture: ComponentFixture<PoolLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({ defaultLanguage: 'en' }),
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
