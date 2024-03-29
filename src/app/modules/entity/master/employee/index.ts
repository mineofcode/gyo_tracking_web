import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddEmployeeComponent } from './aded/addemp.comp';
import { ViewEmployeeComponent } from './view/viewemp.comp';
import { ViewProfileComponent } from './profile/viewprofile.comp';

import { EmployeeService } from '@services/master';

import { LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "view", "urlname": "/employee" } },
      { path: 'profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "emp", "rights": "view", "urlname": "/employee" } },
      { path: 'add', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "add", "urlname": "/add" } },
      { path: 'edit/:id', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "emp", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddEmployeeComponent,
    ViewEmployeeComponent,
    ViewProfileComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, EmployeeService]
})

export class EmployeeModule {
  public static routes = routes;
}
