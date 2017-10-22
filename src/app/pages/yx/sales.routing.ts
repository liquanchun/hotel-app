import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { BookComponent } from './book/book.component';
import { HouseStateComponent } from './housestate/housestate.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      { path: 'book', component: BookComponent },
      { path: 'housestate', component: HouseStateComponent },
      { path: 'schedule', component: ScheduleComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
