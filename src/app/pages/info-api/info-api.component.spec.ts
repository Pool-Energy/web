import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoApiComponent } from './info-api.component';

describe('InfoApiComponent', () => {
  let component: InfoApiComponent;
  let fixture: ComponentFixture<InfoApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
