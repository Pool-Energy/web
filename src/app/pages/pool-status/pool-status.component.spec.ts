import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoolStatusComponent } from './pool-status.component';

import { PagesModule } from '../pages.module';

describe('PoolStatusComponent', () => {
  let component: PoolStatusComponent;
  let fixture: ComponentFixture<PoolStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
