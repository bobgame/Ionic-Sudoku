import { Component, OnInit } from '@angular/core';
import { SudoService } from '../../service/sudo/sudo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  constructor(
    private sudoService: SudoService,
  ) { }

  ngOnInit() {
    // this.sudoService.pauseShowTime()
  }

}
