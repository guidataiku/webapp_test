import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-parameter-dashboard',
  templateUrl: './parameter-dashboard.component.html',
  styleUrl: './parameter-dashboard.component.scss'
})
export class ParameterDashboardComponent {

  constructor(private router: Router, private chapter: ChapterService, private lang: LangService ) {}


  goTo(type: string) {
    const product: string = 'avastin';
    this.router.navigate(['/', this.lang.getCurrentLang(), this.chapter.getCurrentChapter(), product, 'parameter-dashboard', type, 'form']);
  }

}
