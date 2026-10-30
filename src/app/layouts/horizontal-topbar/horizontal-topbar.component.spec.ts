import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { HorizontalTopbarComponent } from './horizontal-topbar.component';

import { LayoutsModule } from '../layouts.module';

describe('HorizontalTopbarComponent', () => {
  let component: HorizontalTopbarComponent;
  let fixture: ComponentFixture<HorizontalTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        LayoutsModule,
      ],
      providers: [provideTranslateService()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
