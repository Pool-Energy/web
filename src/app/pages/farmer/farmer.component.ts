import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { humanizer } from 'humanize-duration';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { compare } from 'compare-versions';
import { NgTerminal } from 'ng-terminal';

import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrl: './farmer.component.scss'
})

export class FarmerComponent implements AfterViewInit {
  @ViewChild('term') term!: NgTerminal;
  breadCrumbItems!: Array<{}>;

  // common
  truncateRequired: boolean = false;
  warningChiaVersion: string = "2.2.0";
  criticalChiaVersion: string = "2.1.0";

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
  blocksDownloadLimit: number = 10000;

  // overview
  difficultyAndPointsData: any[] = [];
  difficultyAndPointsChart: any = {};
  difficultyAndPointsChartLegend: boolean = false;

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
  harvestersTemp: Map<string, object> = new Map();
  harvestersData: any[] = [];
  harvestersTicks: any[] = [];
  harvestersChart: any = {};
  harvestersChartData: any[] = [];
  harvestersChartLegend: boolean = false;

  // rewards
  rewardsData: any[] = [];
  rewardsChart: any = {};
  rewardsChartData: any[] = [];
  rewardsChartLegend: boolean = false;

  // payouts
  payoutaddrs$: Observable<any[]>;
  _payoutaddrs$ = new BehaviorSubject<any[]>([]);
  payoutsCollectionSize: number = 0;
  payoutsPage: number = 1;
  payoutsPageSize: number = 25;
  payoutsCountTotal: number = 0;
  payoutsAmountTotal: number = 0;
  payoutsPerDayChart: any = {};
  payoutsPerDayChartLegend: boolean = false;
  payoutsPerDayChartData: any[] = [];
  payoutsDownloadLimit: number = 100000;

  // payoutstxs
  payouttxs$: Observable<any[]>;
  _payouttxs$ = new BehaviorSubject<any[]>([]);
  payouttxsCollectionSize: number = 0;
  payouttxsPage: number = 1;
  payouttxsPageSize: number = 25;
  payouttxsCountTotal: number = 0;
  payouttxsAmountTotal: number = 0;

  // stats
  launcherSizeChart: any = {};
  launcherSizeChartLegend: boolean = false;
  launcherSizeChartData: any[] = [];

  // logs
  log$: Observable<object> | undefined;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    this.blocks$ = this._blocks$.asObservable();
    this.payoutaddrs$ = this._payoutaddrs$.asObservable();
    this.payouttxs$ = this._payouttxs$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Farmers', link: '/farmers' },
      { label: 'Details', active: true }
    ];

    window.onresize = () => this.truncateRequired = window.innerWidth <= 1200;

    this.route.paramMap.subscribe(data => {
      this.launcher_id = data.get('id');
      this.dataService.getLauncher(this.launcher_id).subscribe(launcher => {
        this.launcher = launcher;
      })
    });

    this.partialsShowFailed = (localStorage.getItem('farmer_show_failed_partials') == 'true') ? true : false;
    this.log$ = this.dataService.log$;

    // default overview tab
    this.refreshLauncherSize(this.launcher_id);
    this.refreshDifficultyAndPoints(this.launcher_id);
    this.refreshPartials(this.launcher_id);
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

  // overview
  refreshDifficultyAndPoints(launcher_id: any) {
    var successes = new Map();
    var errors = new Map();
    var difficulty = new Map();
    var points = new Map();
    var hours = new Set();

    this.partialsTable = [];
    this.partialsFiltered = [];
    this.harvesters.clear();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data: any) => {
        this.partialsCollectionSize = data['count'];
        this.handlePartials(subscriber, data, successes, errors, difficulty, points, hours);
      });
    });

    obs.subscribe(
      (x) => { },
      (err) => { console.error("Something wrong occurred: " + err); },
      () => this.difficultyAndPointsChart = {
        series: [
          {
            name: "Difficulty",
            type: "line",
            data: Array.from(difficulty, (i) => { return { "x": new Date(i[0] * 1000), "y": i[1] }; }).reverse()
          },
          {
            name: "Points",
            type: "column",
            data: Array.from(points, (i) => { return { "x": new Date(i[0] * 1000), "y": i[1] }; }).reverse()
          }
        ],
        legend: {
          show: this.difficultyAndPointsChartLegend
        },
        chart: {
          height: 250,
          type: "area",
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: [
          {
            title: {
              text: "Difficulty",
            }
          },
          {
            opposite: true,
            title: {
              text: "Points",
            }
          }
        ],
        colors: this.getChartColorsArray('["--vz-success","--vz-primary"]')
      }
    );
  }

  // partials
  private handlePartials(subscriber: any, data: any, successes: any, errors: any, difficulty: any, points: any, hours: any) {
    this.partialsTable = this.partialsTable.concat(data['results']);
    data['results'].forEach((v: any) => {
      this.harvesters.add(v['harvester_id']);
      var hour = Math.floor(v['timestamp'] / 3600) * 3600;

      hours.add(hour);
      difficulty.set(hour, v['difficulty']);
      points.set(hour, (points.get(hour) || 0) + v['difficulty']);

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
        this.handlePartials(subscriber, data, successes, errors, difficulty, points, hours);
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

  refreshPartials(launcher_id: any) {
    var successes = new Map();
    var errors = new Map();
    var difficulty = new Map();
    var points = new Map();
    var hours = new Set();

    this.partialsTable = [];
    this.partialsFiltered = [];
    this.harvesters.clear();

    var obs = new Observable(subscriber => {
      this.dataService.getPartials(launcher_id).subscribe((data: any) => {
        this.partialsCollectionSize = data['count'];
        this.handlePartials(subscriber, data, successes, errors, difficulty, points, hours);
      });
    });

    obs.subscribe(
      (x) => { },
      (err) => { console.error("Something wrong occurred: " + err); },
      () => this.partialsChart = {
        series: [
          {
            name: "Successful Partials",
            type: "area",
            data: Array.from(successes, (i) => { return { "x": new Date(i[0] * 1000), "y": i[1] }; }).reverse()
          },
          {
            name: "Failed Partials",
            type: "area",
            data: Array.from(errors, (i) => { return { "x": new Date(i[0] * 1000), "y": i[1] }; }).reverse()
          }
        ],
        legend: {
          show: this.partialsChartLegend
        },
        chart: {
          height: 250,
          type: "area",
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        colors: this.getChartColorsArray('["--vz-success","--vz-danger","--vz-warning"]')
      }
    );
  }

  // harvesters
  supportHarvesterVersion(client_version: any) {
    if(!client_version) { return true; }
    client_version = client_version.split('.');
    if(client_version.length > 3) { client_version.splice(client_version.length-1, 1); }
    client_version = client_version.join('.');
    if(compare(client_version, this.criticalChiaVersion, '<')) {
      return "critical";
    } else if(compare(client_version, this.warningChiaVersion, '<')) {
      return "warning";
    } else {
      return "ok";
    }
  }

  refreshHarvesters(launcher_id: any) {
    var ticks: Set<number> = new Set();
    this.harvestersTemp.clear();
    this.dataService.getPartialTs({launcher: launcher_id}).subscribe((d: any) => {
      (<any[]>d).forEach(i => {
        var harvester: any = this.harvestersTemp.get(i['harvester']);
        if(!harvester) {
          harvester = {
            "points_total": 0,
            "partials_failed": 0,
            "partials_success": 0,
            "version": null,
            "name": null,
            "data": [
              {"name": "Successful Partials", "data": []},
              {"name": "Failed Partials", "data": []}
            ]
          }
          this.dataService.getHarvester({harvester: i['harvester']}).subscribe((h: any) => {
            harvester['version'] = h['results'][0]['version'] ? h['results'][0]['version'] : null;
            harvester['name'] = h['results'][0]['name'] ? h['results'][0]['name'] : null;
          });
          this.harvestersTemp.set(i['harvester'], harvester);
        }
        if(i['result'] == "count") {
          var date = new Date(i['datetime']);
          var hour = Math.floor(date.getTime() / (3600 * 1000)) * 3600;
          ticks.add(hour);
          if(i['error']) {
            harvester['data'][1]['data'].push({"x": date, "y": i['value']});
            harvester['partials_failed'] += i['value'];
          } else {
            harvester['data'][0]['data'].push({"x": date, "y": i['value']});
            harvester['partials_success'] += i['value'];
          }
        } else {
          if(!i['error']) {
            harvester['points_total'] += i['value'];
          }
        }
      });
      this.harvestersData = Array.from(this.harvestersTemp);
      this.harvestersTicks = Array.from(ticks);
      this.harvestersChart = {
        legend: {
          show: this.harvestersChartLegend
        },
        chart: {
          height: 250,
          type: "area",
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        colors: this.getChartColorsArray('["--vz-success","--vz-danger"]')
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

  csvDownloadBlocks() {
    this.dataService.getBlocks({
      launcher: this.launcher_id,
      limit: this.blocksDownloadLimit
    }).subscribe((res: {[key: string]: any}) => {
      let csv_array: Array<any> = [];
      const out = Object.keys(res['results']).map(index => {
        let data = res['results'][index];
        // halving block (https://docs.chia.net/block-rewards/#rewards-schedule)
        let price_rewards = Math.max(0.25 / 2 ** (Math.trunc((data['farmed_height']) / 5045760)), 0.015625);
        csv_array.push({
          datetime: (new Date(Math.floor(data['timestamp']) * 1000).toLocaleString()),
          height: data['farmed_height'],
          amount: data['amount'] / 1000000000000,
          price: (data['xch_price']) ? (data['xch_price']['usd'] * (data['amount'] / 1000000000000)).toFixed(3) : "",
          pool_space: (data['pool_space']) ? (data['pool_space'] / 1024 ** 5).toFixed(2) : "",
          pool_effort: (data['luck']) ? data['luck'] : "",
          farmer_amount: price_rewards,
          farmer_price: (data['xch_price']) ? (data['xch_price']['usd'] * price_rewards).toFixed(3) : "",
          farmer_effort: (data['launcher_effort']) ? data['launcher_effort'] : "",
          farmer_difficulty: data['farmed_by']['difficulty'],
          farmer_estimated_size: (data['farmed_by']['estimated_size']  / 1024 ** 4).toFixed(2)
        });
      });
      var options = {
        headers: [
          "Datetime",
          "Height",
          "Amount (XCH)",
          "Price (USD)",
          "Pool Space (PiB)",
          "Pool Effort (%)",
          "Farmer Amount (XCH)",
          "Farmer Price (USD)",
          "Farmer Effort (%)",
          "Farmer Difficulty",
          "Farmer Estimated Size (TiB)"
        ]
      };
      new AngularCsv(csv_array, 'blocks', options);
    });
  }

  // rewards
  getRewards() {
    this.rewardsData = Array.from(this.launcher.rewards.last_per_day, (i: any) => {
      return {
        "name": i['day'],
        "value": i['amount']
      }
    })
  }

  // payouts
  private handlePayouts(data: any) {
    this.payoutsCollectionSize = data['count'];
    this._payoutaddrs$.next(data['results']);
  }

  refreshPayouts() {
    this.dataService.getPayoutAddrs({
      launcher: this.launcher_id,
      offset: (this.payoutsPage - 1) * this.payoutsPageSize,
      limit: this.payoutsPageSize
    }).subscribe(data => this.handlePayouts(data));
  }

  private handlePayoutTxs(data: any) {
    this.payouttxsCollectionSize = data['count'];
    this._payouttxs$.next(data['results']);
    this.chartPayouts(data);
  }

  refreshPayoutTxs() {
    this.dataService.getPayoutTxs({
      launcher: this.launcher_id,
      offset: (this.payouttxsPage - 1) * this.payouttxsPageSize,
      limit: this.payouttxsPageSize
    }).subscribe(data => this.handlePayoutTxs(data));
  }

  private chartPayouts(data: any) {
    var payoutsPerDay: Map<String, number> = new Map();
    (<any[]>data['results']).map((item) => {
      var date = new Date(item['created_at_time']).toLocaleDateString();
      payoutsPerDay.set(date, (payoutsPerDay.get(date) || 0) + (item['amount'] / (10**12)));
    });
    var seriesPayouts: any = [];
    payoutsPerDay.forEach((v, k) => {
      seriesPayouts.push({"x": k, "y": v.toFixed(6)})
    });

    this.payoutsPerDayChart = {
      series: [{
        name: "Amount (XCH)",
        data: seriesPayouts.reverse(),
      }],
      legend: {
        show: this.payoutsPerDayChartLegend
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
      yaxis: {
        decimalsInFloat: 2
      },
      colors: this.getChartColorsArray('["--vz-primary","--vz-success"]')
    };
  }

  csvDownloadPayouts() {
    this.dataService.getPayoutTxs({
      launcher: this.launcher_id,
      limit: this.payoutsDownloadLimit
    }).subscribe((res: {[key: string]: any}) => {
      let csv_array: Array<any> = [];
      const out = Object.keys(res['results']).map(index => {
        let data = res['results'][index];
        csv_array.push({
          datetime: data['created_at_time'],
          transaction: data['transaction_name'],
          amount: data['amount'] / 1000000000000,
          price: (data['xch_price']) ? data['xch_price']['usd'] * (data['amount'] / 1000000000000) : "",
        });
      });
      var options = {
        headers: [
          "Datetime",
          "Transaction",
          "Amount",
          "Price USD"
        ]
      };
      new AngularCsv(csv_array, 'payouts', options);
    });
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

  // logs
  viewLogs() {
    this.dataService.connectLog();
    this.dataService.sendLog(['partials', 'payments']);
  }

  ngAfterViewInit(): void {
    this.log$!.subscribe({
      next: (log: any) => {
        if(log['message']) {
          if(log['message'].match(this.launcher_id)) {
            this.term.write(log['timestamp'] + ': ' + log['message'] + '\r\n');
          }
        }
      },
      error: (error: any) => {
        this.term.write('Error: ' + error);
      },
      complete: () => { }
    });
  }

  ngOnDestroy(): void {
    this.dataService.disconnectLog();
  }

}
