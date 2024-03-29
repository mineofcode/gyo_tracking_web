import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddEntityComponent } from './aded/addentity.comp';
import { ViewEntityComponent } from './view/viewentity.comp';

import { EntityService } from '@services/master';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  FileUploadModule, AutoCompleteModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "view", "urlname": "/entity" } },
      { path: 'add', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddEntityComponent,
    ViewEntityComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    DataGridModule, PanelModule, CheckboxModule, FileUploadModule, AutoCompleteModule
  ],

  providers: [AuthGuard, EntityService]
})

export class EntityModule {
  public static routes = routes;
}
