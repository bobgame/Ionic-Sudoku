import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { MainComponent } from './main/main.component';
import { GoSoduComponent } from './go-sodu/go-sodu.component';

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
          { path: '', component: MainComponent },
          { path: 'go-sodu', component: GoSoduComponent },
        ]
      },
    ])
  ],
  declarations: [HomePage, MainComponent, GoSoduComponent]
})
export class HomePageModule { }
