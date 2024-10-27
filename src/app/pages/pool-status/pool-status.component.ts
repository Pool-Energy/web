import { Component } from '@angular/core';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-status',
  templateUrl: './pool-status.component.html',
  styleUrl: './pool-status.component.scss'
})

export class PoolStatusComponent {
  breadCrumbItems!: Array<{}>;

  // pool
  blockchainHeight: number = 0;
  blockchainShare: number = 0;

  // wallet
  walletAddressTruncate: boolean = false;
  pool_wallets: Array<any> = new Array();

  // mempool size
  mempoolSizeDays: number = 7;
  mempoolSizeData: any[] = [];
  mempoolSizeChart: any = {};
  mempoolSizeChartLegend: boolean = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/'},
      { label: 'Pool' },
      { label: 'Status', active: true }
    ];

    this.walletAddressTruncate = window.innerWidth <= 2350;
    window.onresize = () => this.walletAddressTruncate = window.innerWidth <= 2350;

    this.dataService.getStats().subscribe((data: any) => {
      this.blockchainHeight = data['blockchain_height'];
      this.blockchainShare = this.getBlockchainShare(data);
      this.pool_wallets = data['pool_wallets'];
    });
    this.getMempoolSize(this.mempoolSizeDays);
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
          } else {
            return newValue;
          }
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

  // blockchain
  getBlockchainShare(data: any) {
    return data['pool_space'] * 100 / data['blockchain_space'];
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

}
