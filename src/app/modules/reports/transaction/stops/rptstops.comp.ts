import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { StopsReportsService } from '@services/master';
import { GMap } from 'primeng/primeng';
import jsPDF from 'jspdf';

declare var google: any;

@Component({
    templateUrl: 'rptstops.comp.html',
    providers: [CommonService]
})

export class StopsReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    tagDT: any = [];
    tagdata: any = [];
    tagid: number = 0;
    tagname: string = "";

    employeeDT: any = [];
    empdata: any = [];
    empid: number = 0;
    empname: string = "";

    frmdt: any = "";
    todt: any = "";

    stopsDT: any = [];

    @ViewChild('stops') stops: ElementRef;

    marker: any;
    @ViewChild("gmap")
    _gmap: GMap;

    private options: any;
    private overlays: any[];
    private map: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _stopservice: StopsReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getTripStops();
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
        var before7days = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before7days);
        this.todt = this.formatDate(today);
    }

    // Auto Completed Employee

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

    // Selected Employee

    selectEmployeeData(event) {
        this.empid = event.value;
        this.empname = event.label;
    }

    // Auto Completed Tag

    getTagData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "tag",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.tagDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Tag

    selectTagData(event) {
        this.tagid = event.value;
        this.tagname = event.label;
    }

    getTripStops() {
        var that = this;

        commonfun.loader();

        that._stopservice.getTripStops({
            "flag": "reports", "frmdt": that.frmdt, "todt": that.todt, "empid": that.empid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "tag": "", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.stopsDT = data.data;
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

    // Map View Lat Lon Wise

    getLatLonWiseMap(row) {
        $("#mapModal").modal('show');

        this.options = {
            center: { lat: row.lat, lng: row.lng },
            zoom: 18
        };

        this.marker = new google.maps.Marker({ position: { lat: row.lat, lng: row.lng }, title: "", draggable: true });
        this.overlays = [this.marker];

        if (row.lat.toString() != "0" && row.lat.toString() != "") {
            var latlng = new google.maps.LatLng(Number(row.lat), Number(row.lng));
            console.log(latlng);
            this.marker.setPosition(latlng);
            // this._gmap.getMap().setCenter(latlng);
        }
    }

    handleMapClick(e) {
        var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        this.marker.setPosition(latlng);
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.stopsDT, "Stops Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.stops.nativeElement, 0, 0, options, () => {
            pdf.save("Stops.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
