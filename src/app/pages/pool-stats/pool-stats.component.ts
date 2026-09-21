import { Component } from '@angular/core';
import { expand } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-pool-stats',
    templateUrl: './pool-stats.component.html',
    styleUrl: './pool-stats.component.scss',
    standalone: false
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

  // partials
  partialsTotalData: any[] = [];
  partialsTotalChart: any = {};
  partialsVersionsData: any[] = [];
  partialsVersionsChart: any = {};
  partialsErrorsData: any[] = [];
  partialsErrorsChart: any = {};
  partialsHostsData: any[] = [];
  partialsHostsChart: any = {};

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
    this.getPartialsStats();

    // Live: partial throughput is event-driven pool-wide, debounce the
    // (heavy, full re-fetch based) partials charts refresh; pool status
    // (blockchain height/space) is not charted here yet, ignored for now.
    this.dataService.connectPoolStats();
    this.dataService.poolStatsLive$.pipe(debounceTime(15000)).subscribe((msg: any) => {
      if(msg['kind'] === 'partial') {
        this.getPartialsStats();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService.disconnectPoolStats();
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
        type: 'date',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0) + " TiB";
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
        type: 'date',
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
        type: 'date',
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
        type: 'date',
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

  // partials total / versions / errors / hosts - derived from a single
  // shared HTTP call instead of one (identical) call per chart.
  getPartialsStats() {
    this.dataService.getPartials('').subscribe((d: any) => {
      const results = <any[]>d.results;

      // total per hour
      const partialsByHour: {[hour: string]: number} = {};
      // versions
      const versionCounts: { [version: string]: number } = {};
      // errors
      const errorCounts: { [error: string]: number } = {};
      // hosts
      const hostCounts: { [host: string]: number } = {};

      results.forEach((item: any) => {
        const date = new Date(item['timestamp'] * 1000);
        const hourKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
        partialsByHour[hourKey] = (partialsByHour[hourKey] || 0) + 1;

        const version = item['chia_version'];
        versionCounts[version] = (versionCounts[version] || 0) + 1;

        const error = item['error'] == null ? "Ok" : item['error'];
        errorCounts[error] = (errorCounts[error] || 0) + 1;

        const host = item['pool_host'] || "Unknown";
        hostCounts[host] = (hostCounts[host] || 0) + 1;
      });

      this.partialsTotalData = [
        {
          "name": "Partials Total (per hour)",
          "data": Object.entries(partialsByHour)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([datetime, count]) => ({
              "x": new Date(datetime).toLocaleString(),
              "y": count,
            }))
        }
      ];
      this.chartPartialsTotal(this.partialsTotalData);

      this.chartPartialsVersions(
        Object.entries(versionCounts).map(([version, count]) => ({ version, count }))
      );

      this.chartPartialsError(
        Object.entries(errorCounts).map(([error, count]) => ({ error, count }))
      );

      this.chartPartialsHosts(
        Object.entries(hostCounts).map(([host, count]) => ({ host, count }))
      );
    });
  }

  private chartPartialsTotal(data: any) {
    this.partialsTotalChart = {
      series: data,
      legend: {
        show: this.partialsTotalChart.legend || false
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
        type: 'date',
        labels: {
          show: false,
        }
      },
      yaxis: {
        min: 0,
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      colors: this.getChartColorsArray('["--vz-success"]'),
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm'
        },
        y: {
          formatter: function(val: number) {
            return Math.round(val) + " partials";
          }
        }
      }
    }
  }

  // partials versions
  private chartPartialsVersions(data: any) {
    this.partialsVersionsChart = {
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
            return val + " partials";
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
  private chartPartialsError(data: any) {
    this.partialsErrorsChart = {
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

  // partials hosts
  private chartPartialsHosts(data: any) {
    this.partialsHostsChart = {
      series: data.map((item: any) => item.count),
      labels: data.map((item: any) => item.host),
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
