import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, MenuService, LoginService, AuthenticationService } from '@services';
import { LoginUserModel, Globals } from '@models';

declare var $: any;

@Component({
    selector: '<leftsidebar></leftsidebar>',
    templateUrl: 'leftsidebar.comp.html',
    providers: [MenuService]
})

export class LeftSideBarComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    ufullname: string = "";
    utype: string = "";
    uphoto: string = "";
    wsname: string = "";
    toggleClass: string = "";

    mainMenuDT: any = [];
    parentMenuDT: any = [];

    constructor(private _authservice: AuthenticationService, public _menuservice: MenuService, private _loginservice: LoginService,
        private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.ufullname = this.loginUser.fullname;
        this.utype = this.loginUser.utype;
        this.uphoto = this.global.uploadurl + this.loginUser.uphoto;
        this.wsname = this.loginUser.wsname;

        if (Cookie.get("_enttdetails_") !== null && Cookie.get("_enttdetails_") !== undefined) {
            this.getMainMenuList();
            this.getParentMenuList();
        }
    }

    ngOnInit() {

    }

    public getMainMenuList() {
        var that = this;

        that._menuservice.getMenuDetails({
            "flag": "main", "uid": that.loginUser.uid, "issysadmin": that._enttdetails.issysadmin,
            "utype": that.loginUser.utype
        }).subscribe(data => {
            that.mainMenuDT = data.data;

            setTimeout(function () {
                $.AdminBSB.leftSideBar.activate();
            }, 100);
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    public getParentMenuList() {
        var that = this;

        that._menuservice.getMenuDetails({
            "flag": "parent", "loginid": that.loginUser.loginid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "issysadmin": that._enttdetails.issysadmin

        }).subscribe(data => {
            that.parentMenuDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    openMainMenu(row) {
        var that = this;

        if (row.mlink !== null) {
            that._router.navigate(['/' + row.mlink]);
        }
        else {
            row.pMenuDT = that.parentMenuDT.filter(a => a.pid === row.mid);
        }
    }

    logout() {
        this._authservice.logout();
    }

    ngOnDestroy() {

    }
}