import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  card_header:BehaviorSubject<string> = new BehaviorSubject("Overview");

  constructor(private router: Router) { }

  ngOnInit() {
    let card_header;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        card_header = event.url.split('/')[2];
      if(card_header === "overview") this.card_header.next("Overview");
      else if(card_header === "pest-detection") this.card_header.next("Pest Detection");
      else if(card_header === "sowing") this.card_header.next("Crop Health and Sowing");
      else if(card_header === "forum") this.card_header.next("Forum");
    });
  }

}
