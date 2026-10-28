import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxFilesizeModule } from 'ngx-filesize';

import { FarmersComponent } from './farmers.component';

import { PagesModule } from '../pages.module';

describe('FarmersComponent', () => {
  let component: FarmersComponent;
  let fixture: ComponentFixture<FarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PagesModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NgxFilesizeModule,
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
