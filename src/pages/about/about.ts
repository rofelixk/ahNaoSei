import { Component } from '@angular/core';
import { NavController, PopoverController, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
	providers: [
	GoogleMaps,
	Geolocation,
	HTTP
	]
})
export class AboutPage {

	constructor(public navCtrl: NavController, 
		public popoverCtrl: PopoverController,
		public alertCtrl: AlertController,
		private googleMaps: GoogleMaps, 
		private geolocation: Geolocation, 
		private http: HTTP) {
	}

	ngAfterViewInit() {
		this.loadMap();
	}

	showAlert(title, subtitle, buttons){
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subtitle,
			buttons: buttons
		});
		alert.present();
	}

	loadMap() {
		let element: HTMLElement = document.getElementById('map');

		let map: GoogleMap = this.googleMaps.create(element);
		map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				map.setMapTypeId('plugin.google.maps.MapTypeId.ROADMAP');
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
					this.showAlert('Erro', 'Não foi possível obter a sua localização', ['OK']);
					alert('Error getting location');
				});

				this.getPlaces();
			});
	}

	getPlaces(){
		this.geolocation.getCurrentPosition().then((resp) => {
			let position = resp.coords.latitude + ',' + resp.coords.longitude;
			let key = 'AIzaSyDl2Oda9y9VVei2LNNaR2mIeUayV1HyeLQ';
			let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+position+'&radius=500&type=restaurant&keyword=pizza&key='+key;
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