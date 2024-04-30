import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { ChapterService } from '../../services/chapter.service';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  public langs: string[] = environment.availableLangs;

  public chapters: string[] = environment.availableChapters;

  public env: string = environment.name;

  constructor(private lang: LangService, private chapter: ChapterService, private route: ActivatedRoute) {}

  public changeLang(lang: string): void {
    console.log(this.route.snapshot.url);
    this.lang.changeLang(lang, this.route.snapshot.url);
  }

  public isLangDisabled(lang: string): boolean {
    return this.lang.getCurrentLang() === lang;
  }

  public changeChapter(chapter: string): void {
    this.chapter.changeChapter(chapter, this.route.snapshot.url)
  }

  public isChapterDisabled(chapter: string): boolean {
    return this.chapter.getCurrentChapter() === chapter;
  }
}
