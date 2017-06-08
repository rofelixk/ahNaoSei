import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	constructor(public navCtrl: NavController) {

	}
	places: any = [
		{ name: 'Barzin', icon: 'beer', color: '#f1c40f' },
		{ name: 'Parquin', icon: 'leaf', color: '#2ecc71' },
		{ name: 'Comidin', icon: 'restaurant', color: '#e74c3c' },
		{ name: 'Cafezin', icon: 'cafe', color: '#2980b9' }];
	selectedPlace: any = 'leaf';
	distance: any = 500;
}