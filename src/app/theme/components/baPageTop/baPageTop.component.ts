import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalState} from '../../../global.state';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public userId:string='';
  constructor(private _router: Router,private _state:GlobalState) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.userId = sessionStorage.getItem("userId"); 
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public signout(){
    //Clear userid and rediction to login page
    sessionStorage.removeItem("userId");
    this._router.navigate( ['login'] );
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
}
