import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { GlobalState } from './../global.state';
import { MenuService } from './sys/components/menu/menu.services';
import * as _ from 'lodash';
@Component({
  selector: 'pages',
  templateUrl: './pages.html',
  providers: [MenuService]
})
export class Pages implements OnInit {

  private menuItems: any;
  private dashboard = {
    path: 'dashboard',
    data: {
      menu: {
        title: 'general.menu.dashboard',
        icon: 'ion-android-home',
        selected: false,
        expanded: false,
        order: 0
      }
    }
  };

  constructor(private _menuService: BaMenuService,
    private _state: GlobalState,
    private _menuItemService: MenuService) {

  }

  ngOnInit() {
    const that = this;
    this._menuItemService.getMenuList().then((menus) => {
      that.menuItems = menus;
    });
    this._state.subscribe('menu.isChanged', (menu) => {
      if (that.menuItems) {
        PAGES_MENU[0]['children'] = [];
        PAGES_MENU[0]['children'].push(that.dashboard);

        const mi = _.find(that.menuItems, ['menuName', menu]);
        console.log(mi);
        if (mi) {
          const mi2 = _.filter(that.menuItems, ['parentId', mi['id']]);
          const secondItem = [];
          _.each(mi2, (m) => {
            const childrenItem = that.getChildrenItem(m['id']);

            const newMenu = {
              path: m['menuAddr'],
              data: {
                menu: {
                  title: m['menuName'],
                  icon: m['icon'],
                  selected: false,
                  expanded: false,
                  order: m['menuOrder']
                }
              },
              children: childrenItem,
            };
            secondItem.push(newMenu);
          });
          console.log(mi2);
          const newMenu = {
            path: mi['menuAddr'],
            data: {
              menu: {
                title: mi['menuName'],
                icon: mi['icon'],
                selected: false,
                expanded: true,
                order: mi['menuAddr'],
              }
            },
            children: secondItem
          };
          PAGES_MENU[0]['children'].push(newMenu);
          this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        }
      }
    });
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }

  getChildrenItem(menuId) {
    const mi = _.filter(this.menuItems, ['parentId', menuId]);
    const childrenItem = [];
    _.each(mi, (m) => {
      const newMenu = {
        path: m['menuAddr'],
        data: {
          menu: {
            title: m['menuName'],
            icon: m['icon'],
            selected: false,
            expanded: false,
            order: m['menuOrder']
          }
        }
      };
      childrenItem.push(newMenu);
    });
    return childrenItem;
  }
}
