import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { About } from './components/about/about';
import { Certifications } from './components/certifications/certifications';
import { Education } from './components/education/education';
import { Experience } from './components/experience/experience';
import { Hero } from './components/hero/hero';
import { Skills } from './components/skills/skills';
import { SocialSidebar } from './components/social-sidebar/social-sidebar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SocialSidebar,
    Hero,
    About,
    Experience,
    Skills,
    Education,
    Certifications
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
