import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Felipe Alves');
  });

  it('should compose the professional sections', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-about')).toBeTruthy();
    expect(compiled.querySelector('app-experience')).toBeTruthy();
    expect(compiled.querySelector('app-skills')).toBeTruthy();
    expect(compiled.querySelector('app-education')).toBeTruthy();
    expect(compiled.querySelector('app-certifications')).toBeTruthy();
  });

  it('should expose one page heading and a skip link to the main content', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelector('.skip-link')?.getAttribute('href')).toBe('#conteudo');
    expect(compiled.querySelector('main')?.id).toBe('conteudo');
  });
});
