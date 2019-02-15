import { Component, OnInit } from '@angular/core';
import { SoduService } from '../service/sodu/sodu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private soduService: SoduService,
  ) { }

  homeShow = {
    number: null
  }

  ngOnInit() {
    this.soduService.pauseShowTime()
  }

  setHomeShowNum(num: number) {
    this.homeShow.number = num
  }
  clearHomeShowNum() {
    this.homeShow.number = null
  }
}
