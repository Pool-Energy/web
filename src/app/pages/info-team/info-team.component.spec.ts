import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTeamComponent } from './info-team.component';

describe('InfoTeamComponent', () => {
  let component: InfoTeamComponent;
  let fixture: ComponentFixture<InfoTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
