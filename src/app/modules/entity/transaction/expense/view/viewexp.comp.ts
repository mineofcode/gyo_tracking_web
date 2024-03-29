import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ExpenseService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewexp.comp.html',
    providers: [CommonService]
})

export class ViewExpenseComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    expenseDT: any = [];

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _expservice: ExpenseService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getExpenseDetails();
    }

    public ngOnInit() {

    }

    getExpenseDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }

        that._expservice.getExpenseDetails(params).subscribe(data => {
            try {
                that.expenseDT = data.data;
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

    public addExpenseForm() {
        this._router.navigate(['/transaction/expense/add']);
    }

    public editExpenseForm(row) {
        this._router.navigate(['/transaction/expense/edit', row.expid]);
    }
}
