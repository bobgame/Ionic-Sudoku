import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'play/:id', loadChildren: './play/play.module#PlayPageModule', runGuardsAndResolvers: 'paramsChange' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'loading', loadChildren: './loading/loading.module#LoadingPageModule' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
