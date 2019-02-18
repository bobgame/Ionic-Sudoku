import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../service/sodu/sodu.service';

@Component({
  selector: 'app-go-sodu',
  templateUrl: './go-sodu.component.html',
  styleUrls: ['./go-sodu.component.scss']
})
export class GoSoduComponent implements OnInit {

  soduPlay = {
    playId: 123,
  }
  constructor(
    private soduService: SoduService,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay
  }

  ngOnInit() { }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}