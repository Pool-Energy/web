import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})

export class JoinComponent {
  breadCrumbItems!: Array<{}>;

  // latency
  pingPoolLatency: number = 0;
  pingPoolUrl: string = 'https://chia.pool.energy';

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Join', active: true }
    ];

    // latency
    this.getPingLatency(this.pingPoolUrl);
  }

  getPingLatency(pingUrl: string) {
    let arr: number[] = [];
    for(let i = 0; i < 3; i++) {
      setTimeout(() => {
        let timeStart: number = performance.now();
        this.httpClient.get(pingUrl, {observe:'response', responseType:'text'}).subscribe(() => {
          let timeEnd: number = performance.now();
          let ping: number = timeEnd - timeStart;
          arr.push(ping);
          this.pingPoolLatency = arr.reduce((a, b) => a + b, 0) / arr.length;
        });
      }, 2000);
    }
  }

}
