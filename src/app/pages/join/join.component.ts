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
  pingPoolUrl: string = 'https://chia.pool.energy';
  pingPoolLatencyArray: number[] = [];
  pingPoolLatencyAverage: number = 0;
  pingPoolLatencyChart: any = {};
  pingPoolLatencyChartLegend: boolean = false;
  pingPoolLatencyChartData: any[] = [];

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Join', active: true }
    ];

    // latency
    this.getPingLatency(this.pingPoolUrl);
  }

  // common
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

  // latency
  getPingLatency(pingUrl: string) {
    for(let i = 0; i < 5; i++) {
      setTimeout(() => {
        let timeStart: number = performance.now();
        this.httpClient.get(pingUrl, {observe:'response', responseType:'text'}).subscribe(() => {
          let timeEnd: number = performance.now();
          let ping: number = timeEnd - timeStart;
          this.pingPoolLatencyArray.push(ping);
          this.pingPoolLatencyAverage = this.pingPoolLatencyArray.reduce((a, b) => a + b, 0) / this.pingPoolLatencyArray.length;
        });
      }, 2000);
    }
    this.chartPingLatency(this.pingPoolLatencyArray);
  }

  private chartPingLatency(data: any) {
    this.pingPoolLatencyChart = {
      series: [{
        name: "Ping",
        data: this.pingPoolLatencyArray,
      }],
      legend: {
        show: this.pingPoolLatencyChartLegend
      },
      noData: {
        text: "Loading..."
      },
      chart: {
        height: 250,
        type: "area",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: any) {
          return val + " ms";
        }
      },
      yaxis: {
        decimalsInFloat: 0
      },
      colors: this.getChartColorsArray('["--vz-primary"]')
    };
  }

}
