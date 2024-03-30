import { Component } from '@angular/core';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-stats',
  templateUrl: './pool-stats.component.html',
  styleUrl: './pool-stats.component.scss'
})

export class PoolStatsComponent {
  breadCrumbItems!: Array<{}>;

  // pool size
  poolSizeDays: number = 14;
  poolSizeData: any[] = [];
  poolSizeChart: any = {};
  poolSizeChartLegend: boolean = false;

  // mempool size
  mempoolSizeDays: number = 14;
  mempoolSizeData: any[] = [];
  mempoolSizeChart: any = {};
  mempoolSizeChartLegend: boolean = false;

  // netspace size
  netspaceSizeDays: number = 14;
  netspaceSizeData: any[] = [];
  netspaceSizeChart: any = {};
  netspaceSizeChartLegend: boolean = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Stats', active: true }
    ];

    this.getPoolSize(this.poolSizeDays);
    this.getMempoolSize(this.mempoolSizeDays);
    this.getNetspaceSize(this.netspaceSizeDays);
  }

  // common
  private getChartColorsArray(colors: any) {
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

  // pool size
  getPoolSize(days: number) {
    this.dataService.getPoolSize(days).subscribe((d: any) => {
      this.poolSizeDays = days;
      this.poolSizeData = [{
        "name": "Pool Size (TiB)",
        "data": (<any[]>d).filter(item => item['field'] == 'global').map((item) => {
          return ({
            "x": (new Date(item['datetime']).toLocaleString()),
            "y": item['value'] / 1024 ** 4,
          })
        })
      }];
      this.chartPoolSize(this.poolSizeData);
    })
  }

  private chartPoolSize(data: any) {
    this.poolSizeChart = {
      series: data,
      legend: {
        show: this.poolSizeChartLegend
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

  // mempool size
  getMempoolSize(days: number) {
    this.dataService.getMempool(days).subscribe((d: any) => {
      this.mempoolSizeDays = days;
      this.mempoolSizeData = [{
        "name": "Full Percentage (%)",
        "data": (<any[]>d).filter(item => item['field'] == 'full_pct').map((item) => {
          return ({
            "x": (new Date(item['datetime']).toLocaleString()),
            "y": item['value'],
          })
        })
      }];
      this.chartMempoolSize(this.mempoolSizeData);
    })
  }

  private chartMempoolSize(data: any) {
    this.mempoolSizeChart = {
      series: data,
      legend: {
        show: this.mempoolSizeChartLegend
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

    // netspace size
    getNetspaceSize(days: number) {
      this.dataService.getNetspace(days).subscribe((d: any) => {
        this.netspaceSizeDays = days;
        this.netspaceSizeData = [{
          "name": "Netspace Size (EiB)",
          "data": (<any[]>d).filter(item => item['field'] == 'size').map((item) => {
            return ({
              "x": (new Date(item['datetime']).toLocaleString()),
              "y": item['value'] / 1024 ** 4,
            })
          })
        }];
        this.chartNetspaceSize(this.netspaceSizeData);
      })
    }
  
    private chartNetspaceSize(data: any) {
      this.netspaceSizeChart = {
        series: data,
        legend: {
          show: this.netspaceSizeChartLegend
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
