import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CultivosComponent } from "./pages/cultivos/cultivos.component";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'cultivos', component: CultivosComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
