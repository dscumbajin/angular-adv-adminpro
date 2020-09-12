import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';



const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    // Carga bajo demanda de modulos, en tiempo de ejecuación LAZYLOAD
    canLoad:[AuthGuard],
    loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
