import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptempatt.comp.html',
    providers: [CommonService, MenuService, ReportsService]
})

export class EmployeeAttendancesComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    monthDT: any = [];
    standardDT: any = [];

    attColumn: any = [];
    attData: any = [];

    monthname: string = "";
    standard: string = "";

    @ViewChild('psngrattnd') psngrattnd: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getAttendanceColumn();
        this.getDefaultMonth();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            $(".enttname input").focus();
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    getDefaultMonth() {
        let date = new Date();
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let mname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);

        this.monthname = mname;
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.attData, 'User Details', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.psngrattnd.nativeElement, 0, 0, options, () => {
            pdf.save("PassengerAttendance.pdf");
        });
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rptservice.getAttendanceReports({ "flag": "filterddl" }).subscribe(data => {
            try {
                that.monthDT = data.data.filter(a => a.group === "month");
                // setTimeout(function () { $.AdminBSB.select.refresh('monthname'); }, 100);
                that.standardDT = data.data.filter(a => a.group === "standard");
                // setTimeout(function () { $.AdminBSB.select.refresh('standard'); }, 100);
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

    // Get Attendent Data

    getAttendanceColumn() {
        var that = this;

        that._rptservice.getAttendanceReports({
            "flag": "column", "monthname": that.monthname, "schoolid": that._enttdetails.enttid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attColumn = data.data;
                that.getAttendanceReports();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getAttendanceReports() {
        var that = this;

        if (that.monthname === "") {
            that._msg.Show(messageType.warn, "Warning", "Select Month");
        }
        else {
            commonfun.loader("#fltrpsngr");

            that._rptservice.getAttendanceReports({
                "flag": "student", "monthname": that.monthname, "standard": that.standard, "schoolid": that._enttdetails.enttid
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        that.attData = data.data;
                    }
                    else {
                        that.attData = [];
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide("#fltrpsngr");
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide("#fltrpsngr");
            }, () => {

            })
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
