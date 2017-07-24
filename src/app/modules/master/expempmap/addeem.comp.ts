import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';

@Component({
    templateUrl: 'addeem.comp.html',
    providers: [CommonService, EmployeeService]
})

export class AddExpenseEmployeeMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    employeeDT: any = [];
    empid: number = 0;
    empname: string = "";

    expenseDT: any = [];
    expid: number = 0;
    expname: string = "";
    expenseList: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService,
        private _empservice: EmployeeService, private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".enttname input").focus();
        }, 100);
    }

    resetUserRights() {
        $(".enttname input").focus();
        this.expid = 0;
        this.expname = "";
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;
    }

    // Auto Completed Employee

    getEmployeeData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.employeeDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Employee

    selectEmployeeData(event) {
        this.empid = event.value;
        this.empname = event.label;
    }

    // Auto Completed Expense

    getExpenseData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "expense",
            "enttid": this.enttid,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.expenseDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Expense

    selectExpenseData(event) {
        this.expid = event.value;
        this.expname = event.label;

        this.addExpenseList();
    }

    // Check Duplicate Expense

    isDuplicateExpense() {
        var that = this;

        for (var i = 0; i < that.expenseList.length; i++) {
            var field = that.expenseList[i];

            if (field.expid == this.expid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Expense not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Expense

    addExpenseList() {
        var that = this;
        //commonfun.loader("#divExpesne");

        var duplicateExpense = that.isDuplicateExpense();

        if (!duplicateExpense) {
            that.expenseList.push({
                "expid": that.expid, "expname": that.expname
            });
        }

        that.expid = 0;
        that.expname = "";
        $(".expname input").focus();
        //commonfun.loaderhide("#divExpense");
    }

    // Delete Expense

    deleteExpesnse(row) {
        this.expenseList.splice(this.expenseList.indexOf(row), 1);
        row.isactive = false;
    }

    resetExpenseFields() {
        this.empid = 0;
        this.empname = "";
        this.expid = 0;
        this.expname = "";
        this.expenseList = [];
    }

    saveExpenseEmployeeMap() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".enttname input").focus();
        }
        else if (that.empid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Employee");
            $(".empname input").focus();
        }
        else if (that.expenseList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter atleast 1 Expense");
            $(".expname input").focus();
        }
        else {
            commonfun.loader();

            var selectedExpense: string[] = [];
            selectedExpense = Object.keys(that.expenseList).map(function (k) { return that.expenseList[k].expid });

            var saveeem = {
                "expid": selectedExpense,
                "empid": that.empid
            }

            this._empservice.updateEmployeeInfo(saveeem).subscribe(data => {
                try {
                    var dataResult = data.data[0].funupdate_employeeinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.resetExpenseFields();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    ngOnDestroy() {
    }
}