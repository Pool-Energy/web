import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolLogsComponent } from './pool-logs.component';

describe('PoolStatsComponent', () => {
  let component: PoolLogsComponent;
  let fixture: ComponentFixture<PoolLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolLogsComponent]
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
