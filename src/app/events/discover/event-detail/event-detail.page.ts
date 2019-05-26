import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Event } from '../../event.model';
import { JoinEventComponent } from './../../../joined-events/join-event/join-event.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: Event;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
    if (!paramMap.has('eventId')) {
      this.navCtrl.navigateBack('/events/tabs/discover');
      return;
    }
    this.event = this.eventsService.getEvent(paramMap.get('eventId'));
  });
  }

  onJoinEvent() {
    // this.router.navigateByUrl('/events/tabs/discover');
    // this.navCtrl.navigateBack('/events/tabs/discover');
    this.modalCtrl.create({component: JoinEventComponent,
    componentProps: {selectedEvent: this.event}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resaultData => {
      console.log(resaultData.data, resaultData.role);
      if(resaultData.role === 'confirm') {
        console.log('Joined');
      }
    });
  }
}
