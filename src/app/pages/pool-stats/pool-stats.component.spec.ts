import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolStatsComponent } from './pool-stats.component';

describe('PoolStatsComponent', () => {
  let component: PoolStatsComponent;
  let fixture: ComponentFixture<PoolStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolStatsComponent]
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
