import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private REST_API_SERVER = "/api/v1.0";

  private _blocks$ = new BehaviorSubject<any[]>([]);
  private _launchers$ = new Subject<any[]>();
  private _payouts$ = new BehaviorSubject<any[]>([]);
  private _payoutaddrs$ = new BehaviorSubject<any[]>([]);
  private _log$ = new BehaviorSubject<any>({});
  private socket$ = new Subject<any>();

  private _poolStatusLive$ = new Subject<any>();
  private poolStatusSocket$?: WebSocketSubject<any>;

  private _poolStatsLive$ = new Subject<any>();
  private poolStatsSocket$?: WebSocketSubject<any>;

  private _blocksLive$ = new Subject<any>();
  private blocksSocket$?: WebSocketSubject<any>;

  private _rewardsLive$ = new Subject<any>();
  private rewardsSocket$?: WebSocketSubject<any>;

  private _farmersLive$ = new Subject<any>();
  private farmersSocket$?: WebSocketSubject<any>;

  private _partialsLive$ = new Subject<any>();
  private partialsSocket$?: WebSocketSubject<any>;

  private _farmerLive$ = new Subject<any>();
  private farmerSocket$?: WebSocketSubject<any>;

  constructor(
    private httpClient: HttpClient
  ) { }

  getStats() {
    return this.httpClient.get(this.REST_API_SERVER + '/stats');
  }

  getMessages() {
    return this.httpClient.get(this.REST_API_SERVER + '/message');
  }

  getBlocks(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
        if(attrs.launcher) params = params.set('farmed_by', attrs.launcher);
        if(attrs.limit) params = params.set('limit', attrs.limit);
        if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/block/', { params });
  }

  getLauncher(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + '/launcher/' + id + '/');
  }

  updateLauncher(id: string, params: any) {
    return this.httpClient.put(this.REST_API_SERVER + '/launcher/' + id + '/', params);
  }

  getLaunchers(attrs: any) {
    var params = new HttpParams();
    params = params.set('is_pool_member', 'true');
    params = params.set('ordering', '-points_pplns');
    if(attrs) {
        if(attrs.offset) params = params.set('offset', attrs.offset);
        if(attrs.limit) params = params.set('limit', attrs.limit);
        if(attrs.search) params = params.set('search', attrs.search);
        if(attrs.points_pplns__gt) params = params.set('points_pplns__gt', attrs.points_pplns__gt);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/launcher/', { params });
  }

  getHarvesters(attrs?: any) {
    var params = new HttpParams();
    if(attrs) {
        if(attrs.launcher) params = params.set('launcher', attrs.launcher);
        if(attrs.harvester) params = params.set('harvester', attrs.harvester);
        if(attrs.version) params = params.set('version', attrs.version);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/harvester/', { params });
  }

  updateHarvester(id: string, params: any) {
    return this.httpClient.put(this.REST_API_SERVER + '/harvester/' + id + '/', params);
  }

  getPartials(launcher: any, offset?: any, days: number = 2) {
    var params = new HttpParams();
    var timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24 * days;
    params = params.set('ordering', '-timestamp');
    params = params.set('min_timestamp', timestamp.toString());
    params = params.set('launcher', launcher);
    params = params.set('offset', (offset || ''));
    params = params.set('limit', 100000);
    return this.httpClient.get(this.REST_API_SERVER + '/partial/', { params });
  }

  getPartialTs(attrs?: any) {
    var params = new HttpParams();
    params = params.set('days', attrs?.days || '1');
    if(attrs) {
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/stats/partial/', { params });
  }

  getPayoutAddrs(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.id) params = params.set('payout', attrs.id);
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/payoutaddress/', { params });
  }

  getPayoutTxs(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/payouttransaction/', { params });
  }

  getReward(id: number) {
    return this.httpClient.get(this.REST_API_SERVER + '/payout/' + id + '/');
  }

  getRewards(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/payout/', { params });
  }

  getRewardAddrs(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.id) params = params.set('payout', attrs.id);
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/payoutaddress/', { params });
  }

  getRewardTxs(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.limit) params = params.set('limit', attrs.limit);
      if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/payouttransaction/', { params });
  }

  getPoolSize(days: number) {
    var params = new HttpParams();
    if(days) {
      params = params.set('days', days);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/pool_size/', { params }); 
  }

  getMempool(days: number) {
    var params = new HttpParams();
    if(days) {
      params = params.set('days', days);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/stats/mempool/', { params });
  }

  getNetspace(days: number) {
    var params = new HttpParams();
    if(days) {
      params = params.set('days', days);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/stats/netspace/', { params });
  }

  getXchPrice(days: number) {
    var params = new HttpParams();
    if(days) {
      params = params.set('days', days);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/stats/xchprice/', { params });
  }

  getLauncherSize(launcher: any, days?: number) {
    var params = new HttpParams();
    params = params.set('launcher', launcher);
    if(days) {
      params = params.set('days', days);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/launcher_size/', { params });
  }

  getHarvester(attrs?: any) {
    var params = new HttpParams();
    if(attrs) {
      if(attrs.launcher) params = params.set('launcher', attrs.launcher);
      if(attrs.harvester) params = params.set('harvester', attrs.harvester);
      if(attrs.limit) params = params.set('limit', attrs.limit);
    }
    return this.httpClient.get(this.REST_API_SERVER + '/harvester/', { params });
  }

  getNext(url: any) {
    return this.httpClient.get(url);
  }

  doLogin(params: any) {
    return this.httpClient.post(this.REST_API_SERVER + '/login', params);
  }

  getLoggedIn() {
    return this.httpClient.get(this.REST_API_SERVER + '/loggedin');
  }

  get log$() {
    return this._log$.asObservable();
  }

  /**
   * Builds the WebSocket URL for a given path (e.g. 'pool_status', 'farmer/<id>'),
   * following the same prod/dev proxy convention as the log socket.
   */
  private _wsUrl(path: string): string {
    var proto = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    var wspath = environment.production ? 'ws' : '_proxy_ws';
    return proto + window.location.host + '/' + wspath + '/' + path + '/';
  }

  /**
   * Opens a WebSocket connection on `path` and forwards every received
   * message to `subject`. Every message from the backend has the shape
   * `{kind: string, payload: any}`. When `unwrap` is true (default, for
   * single-kind streams), only `payload` is emitted; multi-kind streams
   * (farmers/farmer/pool_stats, which aggregate several event kinds) get
   * the full `{kind, payload}` envelope so the component can dispatch.
   */
  private _connectLive(path: string, subject: Subject<any>, unwrap: boolean = true): WebSocketSubject<any> {
    const socket$ = webSocket<any>({ url: this._wsUrl(path) });
    socket$.subscribe({
      next: msg => subject.next(unwrap ? msg['payload'] : msg),
      error: err => console.error('error', err),
      complete: () => { }
    });
    return socket$;
  }

  get poolStatusLive$() {
    return this._poolStatusLive$.asObservable();
  }

  connectPoolStatus() {
    this.poolStatusSocket$ = this._connectLive('pool_status', this._poolStatusLive$);
  }

  disconnectPoolStatus() {
    if(this.poolStatusSocket$) { this.poolStatusSocket$.unsubscribe(); }
  }

  get poolStatsLive$() {
    return this._poolStatsLive$.asObservable();
  }

  connectPoolStats() {
    this.poolStatsSocket$ = this._connectLive('pool_stats', this._poolStatsLive$, false);
  }

  disconnectPoolStats() {
    if(this.poolStatsSocket$) { this.poolStatsSocket$.unsubscribe(); }
  }

  get blocksLive$() {
    return this._blocksLive$.asObservable();
  }

  connectBlocksLive() {
    this.blocksSocket$ = this._connectLive('blocks', this._blocksLive$);
  }

  disconnectBlocksLive() {
    if(this.blocksSocket$) { this.blocksSocket$.unsubscribe(); }
  }

  get rewardsLive$() {
    return this._rewardsLive$.asObservable();
  }

  connectRewardsLive() {
    this.rewardsSocket$ = this._connectLive('rewards', this._rewardsLive$);
  }

  disconnectRewardsLive() {
    if(this.rewardsSocket$) { this.rewardsSocket$.unsubscribe(); }
  }

  get farmersLive$() {
    return this._farmersLive$.asObservable();
  }

  connectFarmersLive() {
    this.farmersSocket$ = this._connectLive('farmers', this._farmersLive$, false);
  }

  disconnectFarmersLive() {
    if(this.farmersSocket$) { this.farmersSocket$.unsubscribe(); }
  }

  get partialsLive$() {
    return this._partialsLive$.asObservable();
  }

  connectPartialsLive() {
    this.partialsSocket$ = this._connectLive('partials', this._partialsLive$, false);
  }

  disconnectPartialsLive() {
    if(this.partialsSocket$) { this.partialsSocket$.unsubscribe(); }
  }

  get farmerLive$() {
    return this._farmerLive$.asObservable();
  }

  connectFarmerLive(launcherId: string) {
    this.farmerSocket$ = this._connectLive('farmer/' + launcherId, this._farmerLive$, false);
  }

  disconnectFarmerLive() {
    if(this.farmerSocket$) { this.farmerSocket$.unsubscribe(); }
  }

  connectLog(msgCallback?: any) {
    var proto = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    var wspath;

    if(environment.production) {
      wspath = 'ws';
    } else {
      wspath = '_proxy_ws';
    }

    this.socket$ = webSocket<string>({
      url: proto + window.location.host + '/' + wspath + '/log/'
    });

    this.socket$.subscribe({
      next: msg => {
        msg['data'].forEach((element: any) => {
          if(typeof element !== 'string') {
            this._log$.next(element);
          }
        });
        if(msgCallback) {
          msgCallback(msg);
        }
      },
      error: err => console.error("error", err),
      complete: () => { }
    });
  }

  sendLog(msg: any) {
    if(!this.socket$) { return; }
    this.socket$.next(JSON.stringify(msg));
  }

  disconnectLog() {
    if(this.socket$) { this.socket$.unsubscribe(); };
  }

}
