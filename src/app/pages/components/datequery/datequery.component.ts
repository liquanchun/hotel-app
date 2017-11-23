import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ViewCell, Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
@Component({
    selector: 'date-query',
    template: `
    <div class="btn-group margin8 pull-right" role="group" aria-label="Basic example">
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 全部</button>
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 昨天</button>
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 今天</button>
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 上周</button>
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 本周</button>
    <button (click)="onClick($event)" type="button" class="btn btn-info btn-sm"><i class="fa fa-refresh" aria-hidden="true"></i> 本月</button>
    </div>
  `
})

export class DateQueryComponent {
    @Output() 
    clickDate = new EventEmitter();

    constructor() {

    }
    onClick(event){
        this.clickDate.emit(event.target.textContent);
    }
}