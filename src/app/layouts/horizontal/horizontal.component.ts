import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-horizontal',
    templateUrl: './horizontal.component.html',
    styleUrls: ['./horizontal.component.scss'],
    standalone: false
})

export class HorizontalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
    }
  }

}
