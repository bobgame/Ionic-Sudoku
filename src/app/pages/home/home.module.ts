import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        children: [
          { path: '', loadChildren: './main/main.module#MainPageModule' },
          { path: 'main', loadChildren: './main/main.module#MainPageModule' },
          { path: 'go-sodu', loadChildren: './go-sodu/go-sodu.module#GoSoduPageModule' },
        ]
      },
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
