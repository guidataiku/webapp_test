import { Injectable } from '@angular/core';
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
import { environment } from '@environment';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

const langIndex: number = 0;

@Injectable({
  providedIn: 'root'
})
export class LangService {

  constructor(private translate: TranslateService, private router: Router) {
    this.translate.addLangs(environment.availableLangs);
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => this.updateLang(event))
      
  }

  private updateLang(event: NavigationEnd): void {
    const urlSegments: string[] = event.urlAfterRedirects.split('/');
    urlSegments.shift();
    if (environment.availableLangs.includes(urlSegments[langIndex]) === false) {
      urlSegments[langIndex] = environment.defaultLang;
      this.router.navigate(['/', ...urlSegments]);
    } else {
      if (urlSegments[langIndex] !== this.translate.currentLang) {
        this.translate.use(urlSegments[langIndex]);
      }
    }
  }

  public changeLang(lang: string, url: UrlSegment[]) {
    const path: string[] = ['/', ...url.map((segment: UrlSegment, index: number) => index === langIndex ? lang : segment.path)];
    this.router.navigate(path);
  }

  public getCurrentLang(): string {
    return this.translate.currentLang;
  }
}
