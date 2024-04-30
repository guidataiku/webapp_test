import { Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { INavigationItem, ITreeNavigationItem } from '../../../types/navigation';
import { mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { ChapterService } from '../../services/chapter.service';
import { TreeNavigationService } from '../../services/tree-navigation.service';
import { RdsMenuComponent, RdsSidenavMenuComponent } from '@rds/angular-components';
import { Router } from '@angular/router';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-tree-navigation',
  templateUrl: './tree-navigation.component.html',
  styleUrl: './tree-navigation.component.scss'
})
export class TreeNavigationComponent implements OnInit, OnDestroy {

  @ViewChildren(RdsSidenavMenuComponent) menus!: QueryList<RdsSidenavMenuComponent>;

  private destroy$: Subject<void> = new Subject();

  public treeItems: ITreeNavigationItem[] = [];

  public currentChapter!: string;

  constructor(private treeNavigation: TreeNavigationService, private chapter: ChapterService, private router: Router, private lang: LangService) {
    this.chapter.getChapterChange()
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((chapter: string) => {
          this.currentChapter = chapter;
          this.treeItems = [];
          return this.treeNavigation.getNavigationByChapter(chapter);
        }),
        tap((items: ITreeNavigationItem[]) => {
          this.treeItems = items;
        })
      ).subscribe();
  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMenuComponent(index: number) {
    console.log(this.menus)
    return this.menus.get(index) as RdsSidenavMenuComponent;
  }

  openLink(product: string, type: string) {
    this.router.navigate(['/', this.lang.getCurrentLang(), this.chapter.getCurrentChapter(), product, type]);
  }
}
