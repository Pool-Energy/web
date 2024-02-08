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

  launcher_id: any = null;
  launcher: any = {};

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
      colors: this.getChartColorsArray('["--vz-primary"]')
    };
  }

  humanize(seconds: number) {
    var h = humanizer();
    return h(seconds, {
      language: "en",
      units: ["y", "mo", "w", "h", "m", "s"],
      largest: 2
    });
  }

}
