import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})

export class RewardsComponent {
  breadCrumbItems!: Array<{}>;

  rewardsTotalClaimed: any = 0;
  rewardsTotalDistributed: any = 0;
  rewardsTotalFee: any = 0;

  _rewards$: Subject<any[]> = new Subject<any[]>();
  rewards$: Observable<any[]>;
  rewardsCollectionSize: number = 0;
  rewardsPage: number = 1;
  rewardsPageSize: number = 10;

  rewardsChart: any = {};
  rewardsChartLegend: boolean = false;
  rewardsChartData: any[] = [];

  constructor(
    private dataService: DataService
  ) {
    this.rewards$ = this._rewards$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Rewards', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.rewardsTotalClaimed = data['rewards_amount'] / (10 ** 12);
      this.rewardsTotalDistributed = (data['rewards_amount'] / (10 ** 12)) - data['fee'];
      this.rewardsTotalFee = (data['rewards_amount'] * data['fee']) / (10 ** 12);
    })

    this.dataService.getRewards({
      limit: this.rewardsPageSize
    }).subscribe(this.handleRewards.bind(this));

    this.dataService.getRewards({
      limit: this.rewardsPageSize
    }).subscribe(this.chartRewards.bind(this));
  }

  private handleRewards(data: any) {
    this.rewardsCollectionSize = data['count'];
    this._rewards$.next(data['results']);
  }

  refreshRewards() {
    this.dataService.getRewards({
      offset: (this.rewardsPage - 1) * this.rewardsPageSize,
      limit: this.rewardsPageSize,
    }).subscribe(this.handleRewards.bind(this));
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

  private chartRewards(data: any) {
    var rewardsData: Map<String, number> = new Map();
    (<any[]>data['results']).map((item) => {
      var date = new Date(item['datetime']).toLocaleDateString();
      rewardsData.set(date, (rewardsData.get(date) || 0) + (item['amount'] / (10**12)));
    });
    var seriesRewards: any = [];
    rewardsData.forEach((v, k) => {
      seriesRewards.push({"x": k, "y": v})
    });
    this.rewardsChart = {
      series: [{
        data: seriesRewards.reverse()
      }],
      legend: {
        show: this.rewardsChartLegend
      },
      chart: {
        height: 250,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      noData: {
        text: "Loading..."
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: any) {
          return val + " XCH";
        }
      },
      colors: this.getChartColorsArray('["--vz-primary"]')
    };
  }

}
