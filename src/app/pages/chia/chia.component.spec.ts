import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ChiaComponent } from './chia.component';

import { PagesModule } from '../pages.module';

describe('ChiaComponent', () => {
  let component: ChiaComponent;
  let fixture: ComponentFixture<ChiaComponent>;

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
    
    fixture = TestBed.createComponent(ChiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
