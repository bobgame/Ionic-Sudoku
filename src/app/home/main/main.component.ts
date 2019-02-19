import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../service/sodu/sodu.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  soduPlay = {
    playId: 123,
  }
  gameName: string
  constructor(
    private soduService: SoduService,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.gameName = this.soduService.soduName
    this.soduPlay = this.soduService.SoduPlay
  }

  ngOnInit() { }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}
