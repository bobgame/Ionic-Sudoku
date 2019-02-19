import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../service/sodu/sodu.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-go-sodu',
  templateUrl: './go-sodu.component.html',
  styleUrls: ['./go-sodu.component.scss']
})
export class GoSoduComponent implements OnInit {

  soduPlay = {
    playId: 123,
  }
  hardModeName: string[]
  gameName: string
  continueButton: boolean
  constructor(
    private soduService: SoduService,
    private router: Router,
    private storage: Storage,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay
    this.gameName = this.soduService.soduName
    this.hardModeName = this.soduService.hardModeName
  }

  ngOnInit() {
    this.storage.get('sd-data').then((data) => {
      if (data) {
        this.continueButton = true
      } else {
        this.continueButton = false
      }
    })
  }

  continueSodu() {
    this.router.navigate([`/play/${this.soduPlay.playId}`])
  }

  goToSodu(hard: string) {
    this.soduService.createNewGame(hard)
    this.router.navigate([`/play/${this.soduPlay.playId}`])
  }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}
