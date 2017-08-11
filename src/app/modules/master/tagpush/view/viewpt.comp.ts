import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { TagService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewpt.comp.html',
    providers: [CommonService]
})

export class ViewPushTagComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    headertitle: string = "";

    emptagDT: any = [];
    pushtagDT: any = [];
    totCountTags: number = 0;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ptservice: TagService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getCountEmpTags();
    }

    public ngOnInit() {

    }

    getCountEmpTags() {
        var that = this;
        commonfun.loader();

        that.totCountTags = 0;

        that._ptservice.getPushTagDetails({
            "flag": "empwisetag", "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.emptagDT = data.data;

                let totCountTags = Object.keys(that.emptagDT).map(function (k) {
                    that.totCountTags += parseInt(that.emptagDT[k].counttag);
                })
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    getPushTagDetails(_empid) {
        var that = this;
        commonfun.loader("#msttag");

        that._ptservice.getPushTagDetails({
            "flag": "tagwiseemp", "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid, "empid": _empid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.pushtagDT = data.data;
                    that.headertitle = data.data[0].empname;
                }
                else{
                    that.pushtagDT = [];
                    that.headertitle = "";
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#msttag");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#msttag");
        }, () => {

        })
    }

    public addPushTag() {
        this._router.navigate(['/master/pushtag/add']);
    }

    public editPushTag(row) {
        this._router.navigate(['/master/pushtag/edit', row.tagid]);
    }
}
