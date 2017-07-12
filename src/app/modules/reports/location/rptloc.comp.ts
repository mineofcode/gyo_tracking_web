import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService } from '@services';
import { LocationService } from '@services/master';
import { LoginUserModel } from '@models';
import { LazyLoadEvent } from 'primeng/primeng';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptloc.comp.html',
    providers: [MenuService]
})

export class LocationReportsComponent implements OnInit, OnDestroy {
    locationDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    @ViewChild('location') location: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _locservice: LocationService) {
        this.loginUser = this._loginservice.getUser();
        this.viewLocationDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.locationDT, 'LocationReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.location.nativeElement, 0, 0, options, () => {
            pdf.save("LocationReports.pdf");
        });
    }

    public viewLocationDataRights() {
        let that = this;
        let addRights = [];
        let editRights = [];
        let viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "rptloc", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getLocationDetails();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getLocationDetails() {
        let that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._locservice.getLocationDetails({
                "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype
            }).subscribe(data => {
                try {
                    that.locationDT = data.data;
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
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}