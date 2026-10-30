import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalComponent } from './horizontal.component';

import { LayoutsModule } from '../layouts.module';
import { provideTranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('HorizontalComponent', () => {
  let component: HorizontalComponent;
  let fixture: ComponentFixture<HorizontalComponent>;

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
    fixture = TestBed.createComponent(HorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
