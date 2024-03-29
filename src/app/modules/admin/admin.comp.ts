import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
  templateUrl: 'admin.comp.html'
})

export class AdminComponent implements OnInit, OnDestroy {
  loginUser: LoginUserModel;
  _wsdetails: any = [];
  _enttdetails: any = [];

  wsname: string = "";
  wslogo: string = "";
  enttname: string = "";

  global = new Globals();

  constructor(private _router: Router, private _loginservice: LoginService) {
    this.loginUser = this._loginservice.getUser();
    this._wsdetails = Globals.getWSDetails();
    this._enttdetails = Globals.getEntityDetails();

    if (Cookie.get('_session_') == null && Cookie.get('_session_') == undefined) {
      this._router.navigate(['/login']);
    }

    this.getHeaderDetails();
  }

  ngOnInit() {

  }

  getHeaderDetails() {
    if (Cookie.get('_session_') != null) {
      this.wsname = this.loginUser.wsname;
      this.wslogo = this.global.uploadurl + this.loginUser.wslogo;
      this.enttname = Cookie.get('_wsdetails_') != null ? this._wsdetails.wsname : "";
    }
  }

  ngOnDestroy() {

  }
}