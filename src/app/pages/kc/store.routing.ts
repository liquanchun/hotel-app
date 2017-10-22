import { Routes, RouterModule } from '@angular/router';

import { StoreComponent } from './store.component';
import { AdddelComponent } from './adddel/adddel.component';
import { GoodsComponent } from './goods/Goods.component';
import { GoodsstoreComponent } from './goodsstore/Goodsstore.component';
import { StoreexcComponent } from './storeexc/Storeexc.component';
import { StoreinComponent } from './storein/Storein.component';
import { StoreoutComponent } from './storeout/Storeout.component';
import { SupplierComponent } from './supplier/Supplier.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent,
    children: [
      { path: 'adddel', component: AdddelComponent },
      { path: 'goods', component: GoodsComponent },
      { path: 'goodsstore', component: GoodsstoreComponent },
      { path: 'storeexc', component: StoreexcComponent },
      { path: 'storein', component: StoreinComponent },
      { path: 'storeout', component: StoreoutComponent },
      { path: 'supplier', component: SupplierComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
