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

  // partials
  partialsData: any[] = [];
  partialsTable: any[] = [];
  partialsFiltered: any[] = [];
  partialsCollectionSize: number = 0;
  partialsPage: number = 1;
  partialsPageSize: number = 100;
  partialsSuccessful: number = 0;
  partialsFailed: number = 0;
  partialsPoints: number = 0;
  partialsShowFailed: boolean = false;
  partialsChart: any = {};
  partialsChartLegend: boolean = false;
  partialsChartData: any[] = [];

  // harvesters
  harvesters: Set<string> = new Set();

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

    this.partialsShowFailed = (localStorage.getItem('farmer_show_failed_partials') == 'true') ? true : false;
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

  // partials
  private handlePartials(subscriber: any, data: any, successes: any, errors: any, hours: any) {
    this.partialsTable = this.partialsTable.concat(data['results']);
    data['results'].forEach((v: any) => {
      this.harvesters.add(v['harvester_id']);
      var hour = Math.floor(v['timestamp'] / 3600) * 3600;
      hours.add(hour);

      if(v.error === null) {
        this.partialsSuccessful++;
        this.partialsPoints += v['difficulty'];
        errors.set(hour, (errors.get(hour) || 0));
        successes.set(hour, (successes.get(hour) || 0) + 1);
      } else {
        this.partialsFailed++;
        errors.set(hour, (errors.get(hour) || 0) + 1);
        successes.set(hour, (successes.get(hour) || 0));
      }
    });

    if(data['next']) {
      this.dataService.getNext(data['next']).subscribe((data) => {
        this.handlePartials(subscriber, data, successes, errors, hours);
      });
    } else {
      subscriber.complete();
      this.filterPartials();
    }
  }

  togglePartialsFailed(event: any): void {
    this.partialsShowFailed = event.target.checked;
    this.filterPartials();
    localStorage.setItem('farmer_show_failed_partials', event.target.checked);
  }

  private filterPartials() {
    if(this.partialsShowFailed) {
      this.partialsFiltered = this.partialsTable.filter(entry => entry.error !== null);
    } else {
      this.partialsFiltered = [...this.partialsTable];
    }
  }

  private chartPartials(launcher_id: any) {
    var successes = new Map();
    var errors = new Map();
    var hours = new Set();

    this.partialsTable = [];
    this.partialsFiltered = [];
    this.harvesters.clear();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data: any) => {
        this.partialsCollectionSize = data['count'];
        this.handlePartials(subscriber, data, successes, errors, hours);
      });
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
