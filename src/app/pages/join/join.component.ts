import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, interval } from 'rxjs';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})

export class JoinComponent {
  breadCrumbItems!: Array<{}>;

  // latency
  pingStream: Subject<number> = new Subject<number>();
  pingPoolLatency: number = 0;
  pingPoolInterval: number = 3000;
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
    this.getPoolLatency(this.pingPoolUrl, this.pingPoolInterval);
  }

  getPoolLatency(pingUrl: string, pingInterval: number) {
    interval(pingInterval).subscribe(() => {
      let timeStart: number = performance.now();
      this.httpClient.get(pingUrl, {observe:'response', responseType:'text'}).subscribe(() => {
        let timeEnd: number = performance.now();
        let ping: number = timeEnd - timeStart;
        this.pingPoolLatency = ping;
        this.pingStream.next(ping);
      });
    });
  }

}
