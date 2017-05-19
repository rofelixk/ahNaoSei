import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HTTP } from '@ionic-native/http';
import { MapSettingPopOver } from './map-settings-pop-over';

@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
	providers: [
	GoogleMaps,
	Geolocation,
	AndroidPermissions,
	HTTP
	], 
	entryComponents:[ MapSettingPopOver ]
})
export class AboutPage {

	constructor(public navCtrl: NavController, 
		public popoverCtrl: PopoverController,
		private googleMaps: GoogleMaps, 
		private geolocation: Geolocation, 
		private androidPermissions: AndroidPermissions,
		private http: HTTP) {
	}

	ngAfterViewInit() {
		this.loadMap();
	}

	loadMap() {
		let element: HTMLElement = document.getElementById('map');

		let map: GoogleMap = this.googleMaps.create(element);

		map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				this.geolocation.getCurrentPosition().then((resp) => {
					let ionic: LatLng = new LatLng(resp.coords.latitude,resp.coords.longitude);

					let position: CameraPosition = {
						target: ionic,
						zoom: 18,
						tilt: 0
					};

					map.moveCamera(position);

					let markerOptions: MarkerOptions = {
						position: ionic,
						title: 'Sua Posição',
						icon: 'blue'
					};

					map.addMarker(markerOptions);

				}).catch((error) => {
					alert('Error getting location');
				});

				this.getPlaces();
			});
	}

	presentPopover(clickEvent) {
		let popover = this.popoverCtrl.create(MapSettingPopOver);
		popover.present({ev: clickEvent});
	}

	getPlaces(){
		this.geolocation.getCurrentPosition().then((resp) => {
			let position = resp.coords.latitude + ',' + resp.coords.longitude;
			let key = 'AIzaSyDl2Oda9y9VVei2LNNaR2mIeUayV1HyeLQ';
			let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+position+'&radius=500&type=restaurant&key='+key;
			alert(url);
			this.http.get(url, {}, {})
			.then(data => {
				alert(data.status);
				alert(data.data);
			})
			.catch(error => {
				alert(error.status);
			});

		}).catch((error) => {
			alert('Error getting location');
		});
	}
}