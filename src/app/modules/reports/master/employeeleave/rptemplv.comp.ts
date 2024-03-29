import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeLeaveService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptemplv.comp.html',
    providers: [CommonService]
})

export class EmployeeLeaveReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";

    status: number = -1;

    @ViewChild('rptemplv') rptemplv: ElementRef;

    empleaveDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _emplvservice: EmployeeLeaveService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getEmployeeLeaveReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var after1month = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(after1month);
    }

    // Auto Completed Assigned By

    getEmployeeData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.employeeDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Assigned By

    selectEmployeeData(event, arg) {
        var that = this;

        that.empid = event.value;
        that.empname = event.label;
    }

    getEmployeeLeaveReports() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all", "frmdt": that.frmdt, "todt": that.todt, "empid": that.empid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
            "status": that.status, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._emplvservice.getEmployeeLeave(params).subscribe(data => {
            try {
                that.empleaveDT = data.data;
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

    resetEmployeeLeaveReports() {
        this.setFromDateAndToDate();
        this.empid = 0;
        this.empname = "";
        this.empdata = [];
        this.status = -1;

        this.getEmployeeLeaveReports();
    }

    // Export

    public exportToCSV() {
        var that = this;
        var params = {};

        commonfun.loader("#divExport");

        params = {
            "flag": "export", "frmdt": that.frmdt, "todt": that.todt, "empid": that.empid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
            "status": that.status, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._emplvservice.getEmployeeLeave(params).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, "Employee Leave Details");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divExport");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divExport");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.rptemplv.nativeElement, 0, 0, options, () => {
            pdf.save("EmployeeTrips.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
