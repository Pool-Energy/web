import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  linkTelegram: string = "https://t.me/chiapoolenergy";
  linkTwitter: string = "https://twitter.com/pool_energy";
  linkReddit: string = "https://www.reddit.com/r/chia/comments/thv366/new_chia_pool_poolenergy/";
  linkYoutube: string = "https://www.youtube.com/channel/UCCHIIBGO-PA-UfxJDlcz0aw";
  linkFacebook: string = "https://www.facebook.com/pool.energy/";

  constructor() { }

  ngOnInit(): void { }

}
