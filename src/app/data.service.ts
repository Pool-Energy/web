import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private REST_API_SERVER = "/api/v1.0";

  private _blocks$ = new BehaviorSubject<any[]>([]);
  private _launchers$ = new Subject<any[]>();

  constructor(
    private httpClient: HttpClient
  ) { }

  getStats() {
    return this.httpClient.get(this.REST_API_SERVER + '/stats');
  }

  getBlocks(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
        if(attrs.launcher) params = params.set('farmed_by', attrs.launcher);
        if(attrs.limit) params = params.set('limit', attrs.limit);
        if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(`${this.REST_API_SERVER}/block/`, {params});
  }

  getLauncher(id: string) {
    return this.httpClient.get(this.REST_API_SERVER + '/launcher/' + id + '/');
  }

  updateLauncher(id: string, params: any) {
    return this.httpClient.put(this.REST_API_SERVER + '/launcher/' + id + '/', params)
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
    return this.httpClient.get(`${this.REST_API_SERVER}/launcher/`, {params});
  }

}
