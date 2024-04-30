import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

  constructor(private router: Router, private chapter: ChapterService, private lang: LangService ) {}


  goTo(type: string) {
    this.router.navigate(['/', this.lang.getCurrentLang(), this.chapter.getCurrentChapter(), 'start', type, 'form']);
  }
}
