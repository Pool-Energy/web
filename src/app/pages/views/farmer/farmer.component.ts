import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { humanizer } from 'humanize-duration';

import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrl: './farmer.component.scss'
})
export class FarmerComponent {
  breadCrumbItems!: Array<{}>;

  // launcher
  launcher_id: any = null;
  launcher: any = {};

  // blocks
  _blocks$: Subject<any[]> = new Subject<any[]>();
  blocks$: Observable<any[]>;
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 15;
  blocksEffortCount: number = 0;
  blocksEffortAverage: number = 0;
  blocksPerDayChart: any = {};
  blocksPerDayChartLegend: boolean = false;
  blocksPerDayChartData: any[] = [];

  // stats
  launcherSizeChart: any = {};
  launcherSizeChartLegend: boolean = false;
  launcherSizeChartData: any[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    this.blocks$ = this._blocks$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Farmers' },
      { label: 'Details', active: true }
    ];

    this.route.paramMap.subscribe(data => {
      this.launcher_id = data.get('id');
      this.dataService.getLauncher(this.launcher_id).subscribe(launcher => {
        this.launcher = launcher;
      })
    });
  }

  // common
  humanize(seconds: number) {
    var h = humanizer();
    return h(seconds, {
      language: "en",
      units: ["y", "mo", "w", "h", "m", "s"],
      largest: 2
    });
  }

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

  // blocks
  refreshBlocks() {
    this.dataService.getBlocks({
      launcher: this.launcher_id,
      offset: (this.blocksPage - 1) * this.blocksPageSize,
      limit: this.blocksPageSize
    }).subscribe(data => this.handleBlocks(data));
  }

  private handleBlocks(data: any) {
    var [blocksEffortFromList, blocksCountFromList]: number[] = [0, 0];
    data['results'].forEach((v: any) => {
      if(v['launcher_effort'] != -1) {
        blocksEffortFromList = blocksEffortFromList + v['launcher_effort'];
        blocksCountFromList = blocksCountFromList + 1;
      }
    });
    this.blocksEffortAverage = blocksEffortFromList / blocksCountFromList;
    this.blocksEffortCount = blocksCountFromList;
    this.blocksCollectionSize = data['count'];
    this._blocks$.next(data['results']);
    this.chartBlocks(data);
  }

  private chartBlocks(data: any) {
    var blocksPerDay: Map<String, number> = new Map();
    (<any[]>data['results']).map((item) => {
      var date = new Date(Math.floor(item['timestamp']) * 1000).toLocaleDateString();
      blocksPerDay.set(date, (blocksPerDay.get(date) || 0) + 1);
    });
    var seriesBlocks: any = [];
    blocksPerDay.forEach((v, k) => {
      seriesBlocks.push({"x": k, "y": v})
    });

    this.blocksPerDayChart = {
      series: [{
        name: "Block(s)",
        data: seriesBlocks.reverse(),
      }],
      legend: {
        show: this.blocksPerDayChartLegend
      },
      chart: {
        height: 250,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: any) {
          return val;
        }
      },
      colors: this.getChartColorsArray('["--vz-primary","--vz-success"]')
    };
  }

  // stats
  refreshLauncherSize(launcher_id: any) {
    this.dataService.getLauncherSize(launcher_id).subscribe((r) => {
      var launcherSize8h: Map<String, number> = new Map();
      var launcherSize24h: Map<String, number> = new Map();
      (<any[]>r).map((item) => {
        if(item['field'] == 'size_8h') {
          launcherSize8h.set(item['datetime'], item['value']);
        } else if(item['field'] == 'size') {
          launcherSize24h.set(item['datetime'], item['value']);
        }
      });
      var launcherSizeSeries8h: any = [];
      var launcherSizeSeries24h: any = [];
      launcherSize8h.forEach((v, k) => {
        launcherSizeSeries8h.push({"x": k, "y": Math.floor(v / (1024 ** 4))});
      })
      launcherSize24h.forEach((v, k) => {
        launcherSizeSeries24h.push({"x": k, "y": Math.floor(v / (1024 ** 4))});
      })

      this.launcherSizeChart = {
        series: [
          {
            name: "Size (8h average)",
            data: launcherSizeSeries8h
          },
          {
            name: "Size (24h average)",
            data: launcherSizeSeries24h
          }
        ],
        legend: {
          show: this.launcherSizeChartLegend
        },
        chart: {
          height: 500,
          type: "area",
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false,
          formatter: function(val: any) {
            return val + "TiB";
          }
        },
        yaxis: {
          min: 0
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        colors: this.getChartColorsArray('["--vz-warning","--vz-success"]')
      };
    });
  }

}
