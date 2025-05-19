import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteHistoryService {
  private readonly STORAGE_KEY = 'routeHistory';
  private history: string[] = [];

  constructor(private router: Router) {
    const storedHistory = localStorage.getItem(this.STORAGE_KEY);
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
    }

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.history.push(event.urlAfterRedirects);
        this.saveToStorage();
      });
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string | null {
    return this.history.length >= 2
      ? this.history[this.history.length - 2]
      : null;
  }

  public clearHistory(): void {
    this.history = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
