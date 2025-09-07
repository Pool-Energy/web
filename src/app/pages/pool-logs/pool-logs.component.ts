import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { Observable } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-pool-logs',
    templateUrl: './pool-logs.component.html',
    styleUrl: './pool-logs.component.scss',
    standalone: false
})

export class PoolLogsComponent implements AfterViewInit {
  @ViewChild('term') term!: NgTerminal;
  @ViewChild('partials') partials!: any;
  @ViewChild('payments') payments!: any;

  breadCrumbItems!: Array<{}>;
  log$: Observable<object> | undefined;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Pool' },
      { label: 'Logs', active: true }
    ];

    this.log$ = this.dataService.log$;
    this.dataService.connectLog();
  }

  changeTopic() {
    var topic = [];
    if(this.partials.nativeElement.checked) topic.push('partials');
    if(this.payments.nativeElement.checked) topic.push('payments');
    this.dataService.sendLog(topic);
  }

  ngAfterViewInit(): void {
      this.log$!.subscribe({
        next: (log: any) => {
          if(log['message']) {
            if(log['funcName']) {
              if(['update_db', 'post_partial', 'check_and_confirm_partial'].includes(log['funcName']) && !this.partials.nativeElement.checked) {
                return;
              }
              if(['submit_payment_loop', 'create_payment_loop'].includes(log['funcName']) && !this.payments.nativeElement.checked) {
                return;
              }
              this.term.write(log['timestamp'] + ': ' + log['levelname'].toLowerCase() + ': ' + log['message'] + '\r\n');
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
