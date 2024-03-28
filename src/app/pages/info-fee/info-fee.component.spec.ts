import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFeeComponent } from './info-fee.component';

describe('InfoFeeComponent', () => {
  let component: InfoFeeComponent;
  let fixture: ComponentFixture<InfoFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
