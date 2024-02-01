import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiaComponent } from './chia.component';

describe('ChiaComponent', () => {
  let component: ChiaComponent;
  let fixture: ComponentFixture<ChiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiaComponent]
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
