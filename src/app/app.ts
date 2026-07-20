import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SocialSidebar } from './components/social-sidebar/social-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SocialSidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}