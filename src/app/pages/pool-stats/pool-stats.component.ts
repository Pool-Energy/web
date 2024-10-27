import { Component } from '@angular/core';
import { expand } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-stats',
  templateUrl: './pool-stats.component.html',
  styleUrl: './pool-stats.component.scss'
})

export class PoolStatsComponent {
  breadCrumbItems!: Array<{}>;

  // pool size
  poolSizeDays: number = 7;
  poolSizeData: any[] = [];
  poolSizeChart: any = {};
  poolSizeChartLegend: boolean = false;

  // mempool size
  mempoolSizeDays: number = 7;
  mempoolSizeData: any[] = [];
  mempoolSizeChart: any = {};
  mempoolSizeChartLegend: boolean = false;

  // netspace size
  netspaceSizeDays: number = 7;
  netspaceSizeData: any[] = [];
  netspaceSizeChart: any = {};
  netspaceSizeChartLegend: boolean = false;

  // xch price
  xchPriceDays: number = 7;
  xchPriceData: any[] = [];
  xchPriceChart: any = {};
  xchPriceChartLegend: boolean = false;

  // farmers / harvesters / partials
  harvestersVersionsData: any[] = [];
  harvestersVersionsChart: any = {};
  partialsData: any[] = [];
  partialsChart: any = {};

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Pool' },
      { label: 'Stats', active: true }
    ];

    this.getPoolSize(this.poolSizeDays);
    this.getMempoolSize(this.mempoolSizeDays);
    this.getNetspaceSize(this.netspaceSizeDays);
    this.getXchPrice(this.xchPriceDays);
    this.getHarvestersVersions();
    this.getPartials();
  }

  // common
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value:any) {
      var newValue = value.replace(" ", "");
      if(newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
          if (color) {
            color = color.replace(" ", "");
            return color;
          } else {
            return newValue;
          }
        } else {
          var val = value.split(',');
          if(val.length == 2) {
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
        "name": "Pool Size (PiB)",
        "data": (<any[]>d).filter(item => item['field'] == 'global').map((item) => {
          return ({
            "x": (new Date(item['datetime']).toLocaleString()),
            "y": item['value'] / 1024 ** 5,
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
        type: 'datetime',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0) + " PiB";
          }
        }
      },
      stroke: {
        width: 2
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
        type: 'datetime',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(2) + " %";
          }
        }
      },
      stroke: {
        width: 2
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
        type: 'datetime',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(2) + " EiB";
          }
        }
      },
      stroke: {
        width: 2
      },
      colors: this.getChartColorsArray('["--vz-success"]')
    }
  }

  // xch price
  getXchPrice(days: number) {
    this.dataService.getXchPrice(days).subscribe((d: any) => {
      this.xchPriceDays = days;
      this.xchPriceData = [
        {
          "name": "XCH Price ($)",
          "data": (<any[]>d).filter(item => item['field'] == 'usd').map((item) => {
            return ({
              "x": (new Date(item['datetime']).toLocaleString()),
              "y": item['value'],
            })
          })
        }
        ];
      this.chartXchPrice(this.xchPriceData);
    })
  }
    
  private chartXchPrice(data: any) {
    this.xchPriceChart = {
      series: data,
      legend: {
        show: this.xchPriceChartLegend
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
        type: 'datetime',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return "$" + val.toFixed(2);
          }
        }
      },
      stroke: {
        width: 2
      },
      colors: this.getChartColorsArray('["--vz-success","--vz-danger"]')
    }
  }

  // harvesters versions
  getHarvestersVersions() {
    this.dataService.getHarvesters().subscribe((d: any) => {
      let versionCounts: { [version: string]: number } = {};
      d.results.forEach((item: any) => {
        const version = item['version'];
        if (versionCounts[version]) {
          versionCounts[version] += 1;
        } else {
          versionCounts[version] = 1;
        }
      });
      const data = Object.entries(versionCounts).map(([version, count]) => ({
        version: version,
        count: count
      }));
      this.chartHarvestersVersions(data);
    });
  }

  private chartHarvestersVersions(data: any) {
    this.harvestersVersionsChart = {
      series: data.map((item: any) => item.count),
      labels: data.map((item: any) => item.version),
      legend: {
        show: true
      },
      chart: {
        height: 350,
        type: "donut",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: true,
        position: 'outside',
        dropShadow: {
          enabled: true
        }
      },
      noData: {
        text: "Loading..."
      },
      xaxis: {
        labels: {
          show: true
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val + " harvesters";
          }
        }
      },
      stroke: {
        width: 2
      },
      colors: [
        "#a6e6c5","#F3B415","#F27036","#663F59","#6A6E94","#4E88B4","#00A7C6","#18D8D8",
        "#A9D794","#46AF78","#A93F55","#8C5E58","#2176FF","#33A1FD","#7A918D","#BAFF29"
      ],
      plotOptions: {
        pie: {
          pie: {
            expandOnClick: true
          }
        }
      }
    }
  }

  // partials errors
  getPartials() {
    this.dataService.getPartials('').subscribe((d: any) => {
      let errorCounts: { [error: string]: number } = {};
      d.results.forEach((item: any) => {
        if (item['error'] == null) {
          item['error'] = "Ok";
        }
        const error = item['error'];
        if (errorCounts[error]) {
          errorCounts[error] += 1;
        } else {
          errorCounts[error] = 1;
        }
      });
      const data = Object.entries(errorCounts).map(([error, count]) => ({
        error: error,
        count: count
      }));
      this.chartPartialsError(data);
    });
  }

  private chartPartialsError(data: any) {
    this.partialsChart = {
      series: data.map((item: any) => item.count),
      labels: data.map((item: any) => item.error),
      legend: {
        show: true
      },
      chart: {
        height: 350,
        type: "donut",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: true,
        position: 'outside',
        dropShadow: {
          enabled: true
        }
      },
      noData: {
        text: "Loading..."
      },
      xaxis: {
        labels: {
          show: true
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val + " partial(s)";
          }
        }
      },
      stroke: {
        width: 2
      },
      colors: [
        "#a6e6c5","#F3B415","#F27036","#663F59","#6A6E94","#4E88B4","#00A7C6","#18D8D8",
        "#A9D794","#46AF78","#A93F55","#8C5E58","#2176FF","#33A1FD","#7A918D","#BAFF29"
      ],
      plotOptions: {
        pie: {
          pie: {
            expandOnClick: true
          }
        }
      }
    }
  }

}
