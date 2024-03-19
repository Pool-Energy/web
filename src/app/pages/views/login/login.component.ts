import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  @ViewChild('name') name: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('customDifficulty') customDifficulty: ElementRef;
  @ViewChild('minPayout') minPayout: ElementRef;

  // default
  loggingIn: boolean = true;
  loggedIn: boolean = false;
  error: boolean = false;
  farmer: any = {};

  // errors
  nameError: string = "";
  emailError: string = "";
  customDifficultyError: string = "";
  minPayoutError: string = "";

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Login', active: true }
    ];

    this.route.queryParams.subscribe(data => {
      if(!data.launcher_id) {
        this.dataService.getLoggedIn().subscribe(res => {
          if(res['launcher_id']) {
            this.onLoggedIn(res['launcher_id']);
          } else {
            this.loggingIn = false;
            this.error = true;
          }
        })
      } else {
        this.dataService.doLogin(data).subscribe(
          success => {
            this.onLoggedIn(data.launcher_id);
          },
          error => {
            this.loggingIn = false;
            this.error = true;
          }
        );
      }
    });
  }

  private onLoggedIn(launcher_id: string) {
    this.loggingIn = false;
    this.loggedIn = true;
  }

  submit() {
    this.nameError = "";
    this.emailError = "";
    this.customDifficultyError = "";
    this.minPayoutError = "";

    this.dataService.updateLauncher(this.farmer.launcher_id, {
      "name": this.name.nativeElement.value,
      "email": (this.email.nativeElement.value) ? this.email.nativeElement.value : null,
      "custom_difficulty": (this.customDifficulty.nativeElement.value) ? this.customDifficulty.nativeElement.value : null,
      "minimum_payout": (this.minPayout.nativeElement.value) ? this.minPayout.nativeElement.value * 1000000000000 : null
    }).subscribe(
      data => {
        this.router.navigate(['/farmer', this.farmer.launcher_id]);
      },
      error => {
        this.nameError = error.error?.name;
        this.emailError = error.error?.email;
        this.customDifficultyError = error.error?.custom_difficulty;
        this.minPayoutError = error.error?.minimum_payout;
      }
    );
  }

}
