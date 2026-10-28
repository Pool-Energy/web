import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoolStatsComponent } from './pool-stats.component';

import { PagesModule } from '../pages.module';

describe('PoolStatsComponent', () => {
  let component: PoolStatsComponent;
  let fixture: ComponentFixture<PoolStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
