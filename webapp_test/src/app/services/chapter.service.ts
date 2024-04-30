import { Injectable } from '@angular/core';
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
import { environment } from '@environment';
import { BehaviorSubject, filter, Observable } from 'rxjs';

const langIndex: number = 1;

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  private chapter: string = environment.defaultChapter;

  private chapter$: BehaviorSubject<string> = new BehaviorSubject<string>(this.chapter);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => this.updateChapter(event))
      
  }

  private updateChapter(event: NavigationEnd): void {
    const urlSegments: string[] = event.urlAfterRedirects.split('/');
    urlSegments.shift();
    if (environment.availableChapters.includes(urlSegments[langIndex]) === false) {
      urlSegments[langIndex] = environment.defaultChapter;
      this.router.navigate(['/', ...urlSegments]);
    } else {
      if (urlSegments[langIndex] !== this.chapter) {
        this.chapter = urlSegments[langIndex];
        this.chapter$.next(this.chapter);
      }
    }
  }

  public changeChapter(chapter: string, url: UrlSegment[]) {
    const path: string[] = ['/', ...url.map((segment: UrlSegment, index: number) => index === langIndex ? chapter : segment.path)];
    this.router.navigate(path);
  }

  public getCurrentChapter(): string {
    return this.chapter;
  }

  public getChapterChange(): Observable<string> {
    return this.chapter$.asObservable();
  }
}
