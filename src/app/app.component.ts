import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SudoService } from './service/sudo/sudo.service';
import { LanService } from './service/lan/lan.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  sudoPlay = {
    playId: 1,
  }
  LanData: any

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private sudoService: SudoService,
    private lanService: LanService,
  ) {
    this.initializeApp()
    this.sudoPlay = this.sudoService.SudoPlay
    this.sudoPlay.playId = Math.floor(Math.random() * 1000)
    // console.log('app component')
    lanService.getLanguage().then(() => {
      lanService.getLanJson()
        .subscribe((data) => this.LanData = data);
      lanService.getLanData()
    })
    events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })
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
