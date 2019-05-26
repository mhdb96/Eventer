import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Event} from '../event.model';
import { from } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedEvents: Event[];

  constructor(private eventservices: EventsService) { }

  ngOnInit() {

    this.loadedEvents = this.eventservices.events;
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);

  }

}
