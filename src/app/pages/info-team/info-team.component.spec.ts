import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InfoTeamComponent } from './info-team.component';

import { PagesModule } from '../pages.module';

describe('InfoTeamComponent', () => {
  let component: InfoTeamComponent;
  let fixture: ComponentFixture<InfoTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({ defaultLanguage: 'en' }),
      ],
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
