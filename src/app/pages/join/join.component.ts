import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, of, interval } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})

export class JoinComponent {
  breadCrumbItems!: Array<{}>;
  private pingSubscription: Subscription = new Subscription();

  // pools
  endpoints: any[] = environment.pools;
  latencies: {[key: string]: number} = {};

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Join', active: true }
    ];

    this.pingSubscription = interval(2000).subscribe(() => {
      this.endpoints.forEach(endpoint => {
        this.pingLatency(endpoint.url).subscribe((latency: number) => {
          this.latencies[endpoint.url] = latency;
        });
      });
    });
  }

  // latency
  private pingLatency(url: string): Observable<number> {
    const start = Date.now();
    return this.httpClient.get('https://' + url, {responseType: 'text'}).pipe(
      map(() => Date.now() - start),
      catchError(() => of(-1))
    );
  }

  ngOnDestroy(): void {
    if(this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
  }

}
