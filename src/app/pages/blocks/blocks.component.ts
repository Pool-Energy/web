import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrl: './blocks.component.scss'
})

export class BlocksComponent {
  breadCrumbItems!: Array<{}>;

  estimate_win: any = 0;
  current_effort: any = 0;

  _blocks$: Subject<any[]> = new Subject<any[]>();
  blocks$: Observable<any[]>;
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 15;
  lastBlock: any;

  blocksPerDayChart: any = {};
  blocksPerDayChartLegend: boolean = false;
  blocksPerDayChartData: any[] = [];

  blocksPerEffortChart: any = {};
  blocksPerEffortChartLegend: boolean = false;
  blocksPerEffortChartData: any[] = [];

  constructor(
    private dataService: DataService
  ) {
    this.blocks$ = this._blocks$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Blocks', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.estimate_win = this.secondsToHuman(data['estimate_win'] * 60);
      this.current_effort = (data['time_since_last_win'] / (data['estimate_win'] * 60)) * 180;
    })

    this.dataService.getBlocks({
      limit: this.blocksPageSize
    }).subscribe(this.handleBlocks.bind(this));
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

  private chartBlocks(data: any) {
    var blocksPerDay: Map<String, number> = new Map();
    var blocksPerEffort: Map<String, number> = new Map();
    (<any[]>data['results']).map((item) => {
      var date = new Date(Math.floor(item['timestamp']) * 1000).toLocaleDateString();
      blocksPerDay.set(date, (blocksPerDay.get(date) || 0) + 1);
      blocksPerEffort.set(date, (blocksPerEffort.get(date) || 0) + item['luck']);
    });
    var seriesBlocks: any = [];
    blocksPerDay.forEach((v, k) => {
      seriesBlocks.push({"x": k, "y": v})
    });
    var seriesEffort: any = [];
    blocksPerEffort.forEach((v, k) => {
      seriesEffort.push({"x": k, "y": v})
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
      colors: this.getChartColorsArray('["--vz-primary"]')
    };

    this.blocksPerEffortChart = {
      series: [{
        name: "Effort",
        data: seriesEffort.reverse(),
      }],
      legend: {
        show: this.blocksPerEffortChartLegend
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
          return val + "%";
        }
      },
      stroke: {
        width: 2
      },
      colors: this.getChartColorsArray('["--vz-success"]')
    };
  }

  private handleBlocks(data: any) {
    this.blocksCollectionSize = data['count'];
    this._blocks$.next(data['results']);
    this.lastBlock = data['results'][0];
    this.chartBlocks(data);
  }

  refreshBlocks() {
    this.dataService.getBlocks({
      offset: (this.blocksPage - 1) * this.blocksPageSize,
      limit: this.blocksPageSize,
    }).subscribe(this.handleBlocks.bind(this));
  }

  private secondsToHuman(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var hDisplay = h > 0 ? h + "h" : "";
    var mDisplay = m > 0 ? m + "m" : "";
    return hDisplay + " " + mDisplay
  }

}
