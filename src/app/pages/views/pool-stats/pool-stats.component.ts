import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-stats',
  templateUrl: './pool-stats.component.html',
  styleUrl: './pool-stats.component.scss'
})
export class PoolStatsComponent {
  breadCrumbItems!: Array<{}>;

  mempoolDays: number = 7;
  mempoolData: any[] = [];
  mempoolChart: any = {};
  mempoolChartLegend: boolean = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Stats', active: true }
    ];
    this.getMempool(this.mempoolDays);
  }

  getMempool(days: number) {
    this.dataService.getMempool(days).subscribe((d) => {
      this.mempoolDays = days;
      this.mempoolData = [{
        "name": "Full Percentage",
        "data": (<any[]>d).filter(item => item['field'] == 'full_pct').map((item) => {
          return ({
            "x": (new Date(item['datetime']).toLocaleString()),
            "y": item['value'],
          })
        })
      }];
      this.chartMempool(this.mempoolData);
    })
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

  private chartMempool(data: any) {
    this.mempoolChart = {
      series: data,
      legend: {
        show: this.mempoolChartLegend
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      noData: {
        text: "Loading..."
      },
      xaxis: {
        labels: {
          show: false
        }
      },
      yaxis: {
        decimalsInFloat: 0
      },
      colors: this.getChartColorsArray('["--vz-success"]')
    }
  }

}
