import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptmonthlyatt.comp.html',
    providers: [CommonService, EmployeeService]
})

export class MonthlyAttendanceComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    monthDT: any = [];
    standardDT: any = [];

    attColumn: any = [];
    attData: any = [];

    monthname: string = "";

    @ViewChild('psngrattnd') psngrattnd: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptempservice: EmployeeService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultMonth();
        this.getMonthlyAttendanceData();
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
        this._autoservice.exportToCSV(this.attData, "User Details");
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

        that._rptempservice.getEmployeeAttendance({ "flag": "filterddl" }).subscribe(data => {
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

    getMonthlyAttendanceData() {
        var that = this;

        that._rptempservice.getEmployeeAttendance({
            "flag": "column", "monthname": that.monthname, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attColumn = data.data;
                that.getEmployeeAttendance();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getEmployeeAttendance() {
        var that = this;

        if (that.monthname === "") {
            that._msg.Show(messageType.warn, "Warning", "Select Month");
        }
        else {
            commonfun.loader("#fltrpsngr");

            that._rptempservice.getEmployeeAttendance({
                "flag": "monthly", "monthname": that.monthname, "enttid": that._enttdetails.enttid,
                "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
