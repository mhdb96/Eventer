import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController
} from '@ionic/angular';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { EventLocation, Coordinates } from '../../../events/location.model';
import { of } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImg: string;
  isLoading = false;
  @Output() locationPick = new EventEmitter<EventLocation>();
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto Locate',
            handler: () => {
              this.locateUser();
            }
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            }
          },
          { text: 'Cancel', role: 'cancel' }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }

    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.longitude,
          lng: geoPosition.coords.longitude
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location',
        buttons: ['OK']

      })
      .then(alertEl => alertEl.present());
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: EventLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImgUrl: null
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap(address => {
          pickedLocation.address = address;
          return of(this.getMapImg(pickedLocation.lat, pickedLocation.lng, 14));
        })
      )
      .subscribe(staticMapImgUrl => {
        pickedLocation.staticMapImgUrl = staticMapImgUrl;
        this.selectedLocationImg = staticMapImgUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }
  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsAPIKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImg(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?${lat},${lng}&zoom=${14}&size=500x300&maptype=roadmap
    &markers=color:blue%7Clabel:Event%7C${lat},${lng}&key=${
      environment.googleMapsAPIKey
    }`;
  }
  ngOnInit() {}
}
