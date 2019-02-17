import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SoduService } from './service/sodu/sodu.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  soduPlay = {
    playId: 1,
  }

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private soduService: SoduService,
  ) {
    this.initializeApp()
    this.soduPlay = this.soduService.SoduPlay
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    console.log(this.soduPlay.playId)
  }

  ngOnInit() {
    // this.playId = this.getDate()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

}
