import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  breadCrumbItems!: Array<{}>;

  @ViewChild('farmerName') farmerName!: | ElementRef<any>;
  @ViewChild('farmerEmail') farmerEmail!: | ElementRef<any>;
  @ViewChild('minPayout') minPayout!: | ElementRef<any>;
  @ViewChild('customDifficulty') customDifficulty!: | ElementRef<any>;
  @ViewChild('customDifficultyValue') customDifficultyValue!: | ElementRef<any>;

  loggingIn: boolean = true;
  loggedIn: boolean = false;
  farmer: any = {};
  error: boolean = false;
  difficultyValue: string = "";
  farmerNameError: string = "";
  farmerEmailError: string = "";
  minPayoutError: string = "";
  customDifficultyError: string = "";

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Settings', active: true }
    ];

    this.route.queryParams.subscribe((data: {[key: string]: any}) => {
      if(!data['launcher_id']) {
        this.dataService.getLoggedIn().subscribe((res: {[key: string]: any}) => {
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
            this.onLoggedIn(data['launcher_id']);
          },
          error => {
            this.loggingIn = false;
            this.error = true;
          }
        );
      }
    });
  }

  onLoggedIn(launcher_id: string) {
    this.loggingIn = false;
    this.loggedIn = true;
    this.dataService.getLauncher(launcher_id).subscribe(launcher => {
      this.farmer = launcher;
    });
  }

  saveSettings() {
    this.farmerNameError = "";
    this.farmerEmailError = "";
    this.minPayoutError = "";
    this.customDifficultyError = "";

    if(this.customDifficultyValue.nativeElement.value) {
      if(this.validateCustomDifficulty(this.customDifficultyValue.nativeElement.value)) {
        this.difficultyValue = ':' + this.customDifficultyValue.nativeElement.value;
      }
    }

    this.dataService.updateLauncher(this.farmer.launcher_id, {
      "name": this.farmerName.nativeElement.value,
      "email": (this.farmerEmail.nativeElement.value) ? this.farmerEmail.nativeElement.value : null,
      "minimum_payout": (this.minPayout.nativeElement.value) ? this.minPayout.nativeElement.value * 1000000000000 : null,
      "custom_difficulty": (this.customDifficulty.nativeElement.value) ? this.customDifficulty.nativeElement.value + this.difficultyValue : null,
    }).subscribe(
      data => {
        this.router.navigate(['/farmer', this.farmer.launcher_id]);
      },
      error => {
        this.farmerNameError = error.error?.farmer_name;
        this.farmerEmailError = error.error?.farmer_email;
        this.minPayoutError = error.error?.min_payout;
        this.customDifficultyError = error.error?.custom_difficulty
      }
    );
  }

  setCustomDifficulty(data: any) {
    const element = document.getElementById("ifCustomValue");
    if(element && data.target.value) {
      if(data.target.value == "CUSTOM") {
        element.style.display = "block"
      } else {
        element.style.display = "none"
      }
    }
  }

  validateCustomDifficulty(value: any) {
    if(value < 10 || value > 150) {
      return false;
    }
    return true;
  }

}