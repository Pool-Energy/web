import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-reward',
    templateUrl: './reward.component.html',
    styleUrl: './reward.component.scss',
    standalone: false
})

export class RewardComponent {
  breadCrumbItems!: Array<{}>;

  reward: any = {};
  reward_id: any = 0;

  rewardaddrs$: Observable<any[]>;
  _rewardaddrs$: Subject<any[]> = new Subject<any[]>();

  rewardaddrsCollectionSize: number = 0;
  rewardaddrsPage: number = 1;
  rewardaddrsPageSize: number = 25;

  rewardaddrsChart: any = {};
  rewardaddrsChartLegend: boolean = false;
  rewardaddrsChartData: any[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    this.rewardaddrs$ = this._rewardaddrs$.asObservable();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.reward_id = data.get('id');

      this.breadCrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Rewards', link: '/rewards' },
        { label: this.reward_id, active: true }
      ];

      this.dataService.getRewardAddrs({
        id: this.reward_id
      }).subscribe(this.handleRewardAddrs.bind(this));

      this.dataService.getRewardAddrs({
        id: this.reward_id
      }).subscribe(this.chartRewardAddrs.bind(this));

      this.dataService.getReward(this.reward_id).subscribe((res) => {
        this.reward = res;
      });
    });
  }

  private getChartColorsArray(colors:any) {
    colors = JSON.parse(colors);
    return colors.map(function (value:any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
            color = color.replace(" ", "");
            return color;
            }
            else return newValue;;
        } else {
            var val = value.split(',');
            if (val.length == 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
  }

  private chartRewardAddrs(data: any) {
    const series = (<any[]>data['results']).map((item) => {
      return ({
        "x": (item['launcher'] == null && "?") || (item['launcher']['name'] || item['launcher']['launcher_id']),
        "y": item['amount'] / (10 ** 12),
      })
    });
    this.rewardaddrsChart = {
      series: [{
        data: series
      }],
      legend: {
        show: this.rewardaddrsChartLegend
      },
      chart: {
        height: 250,
        type: "treemap",
        toolbar: {
          show: false
        }
      },
      colors: this.getChartColorsArray('["--vz-primary"]')
    };
  }

  private handleRewardAddrs(data: any) {
    this.rewardaddrsCollectionSize = data['count'];
    this._rewardaddrs$.next(data['results']);
  }

  refreshRewardAddrs() {
    this.dataService.getRewardAddrs({
      id: this.reward_id,
      offset: (this.rewardaddrsPage - 1) * this.rewardaddrsPageSize,
      limit: this.rewardaddrsPageSize
    }).subscribe(this.handleRewardAddrs.bind(this));
  }

}
