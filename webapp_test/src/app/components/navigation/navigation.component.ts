import { Component, OnDestroy, OnInit } from '@angular/core';
import { INavigationItem } from '../../../types/navigation';
import { mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { ChapterService } from '../../services/chapter.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject();

  public items: INavigationItem[] = [];

  constructor(private navigation: NavigationService, private chapter: ChapterService) {
    this.chapter.getChapterChange()
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((chapter: string) => {
          this.items = [];
          return this.navigation.getNavigationByChapter(chapter);
        }),
        tap((items: INavigationItem[]) => {
          this.items = items;
        })
      ).subscribe();
  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 
