import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFaqComponent } from './info-faq.component';

describe('InfoFaqComponent', () => {
  let component: InfoFaqComponent;
  let fixture: ComponentFixture<InfoFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
