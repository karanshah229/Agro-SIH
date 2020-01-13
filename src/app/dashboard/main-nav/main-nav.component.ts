import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Subscription;
  isMobile:boolean = false;
  @ViewChild('drawer', {static: false}) public sidenav: MatSidenav;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private afa: AngularFireAuth,
    private router: Router) {
      this.isHandset$ = this.breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.isMobile = true;
        } else this.isMobile = false;
      });
  }

  //Close side nav on click - mobile
  close_side_nav(){
    if(this.isMobile) this.sidenav.close();
  }

  logout(){
    this.afa.auth.signOut().then(() => {
      this.router.navigateByUrl('');
    })
  }

}
