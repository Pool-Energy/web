import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolStatusComponent } from './pool-status.component';

describe('PoolStatusComponent', () => {
  let component: PoolStatusComponent;
  let fixture: ComponentFixture<PoolStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolStatusComponent]
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
