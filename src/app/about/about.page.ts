import { Component, OnInit } from '@angular/core';
import { SoduService } from '../service/sodu/sodu.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  constructor(
    private soduService: SoduService,
  ) { }

  ngOnInit() {
    this.soduService.pauseShowTime()
  }

}
