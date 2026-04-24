import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  isDarkMode: boolean = false;
  isMobileMenuOpen: boolean = false;
  prefersReducedMotion = false;

  private observer?: IntersectionObserver;
  private reduceMotionQuery?: MediaQueryList;

  constructor(
    private themeService: ThemeService,
    private destroyRef: DestroyRef,
    private hostElement: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {
    this.themeService.darkMode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? undefined;
    this.prefersReducedMotion = this.reduceMotionQuery?.matches ?? false;
  }

  ngAfterViewInit() {
    if (this.prefersReducedMotion) {
      this.revealAll();
      return;
    }

    const targets = this.hostElement.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
    targets.forEach(target => target.classList.add('motion-reveal'));

    if (typeof IntersectionObserver === 'undefined') {
      this.revealAll();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    targets.forEach(target => this.observer?.observe(target));
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  private revealAll() {
    const targets = this.hostElement.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
    targets.forEach(target => target.classList.add('is-visible'));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
