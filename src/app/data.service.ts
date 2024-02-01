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

  constructor(
    private httpClient: HttpClient
  ) { }

  getBlocks(attrs: any) {
    var params = new HttpParams();
    if(attrs) {
        if(attrs.launcher) params = params.set('farmed_by', attrs.launcher);
        if(attrs.limit) params = params.set('limit', attrs.limit);
        if(attrs.offset) params = params.set('offset', attrs.offset);
    }
    return this.httpClient.get(`${this.REST_API_SERVER}/block/`, {params});
  }
}
