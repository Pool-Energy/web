import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})

export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  links = {
    "telegram": "https://t.me/chiapoolenergy",
    "xing": "https://x.com/pool_energy",
    "reddit": "https://www.reddit.com/r/chia/comments/thv366/new_chia_pool_poolenergy/",
    "youtube": "https://www.youtube.com/channel/UCCHIIBGO-PA-UfxJDlcz0aw",
    "facebook": "https://www.facebook.com/pool.energy/",
    "discord": "https://discord.gg/arZDWsY5xZ",
    "github": "https://github.com/Pool-Energy"
  }

  constructor() { }

  ngOnInit(): void { }

}
