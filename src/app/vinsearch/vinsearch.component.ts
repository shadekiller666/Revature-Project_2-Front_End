import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../interface/vehicle';

@Component({
	selector: 'app-vinsearch',
	templateUrl: './vinsearch.component.html',
	styleUrls: ['./vinsearch.component.css']
})
export class VinsearchComponent implements OnInit {
	vehicles!: Observable<Vehicle[]>;
	vins!: Observable<Vehicle[]>;
	private searchTerms = new Subject<string>();

	constructor(private vehicleService: VehicleService) {}

	// Push a search term into the observable stream.
	search(term: string): void {
    this.searchTerms.next(term);
	}

	ngOnInit(): void {
		this.vehicles = this.vehicleService.getAllVehicle();
		this.vins = this.searchTerms.pipe(
			// wait 300ms after each keystroke before considering the term
      		debounceTime(300),

      		// ignore new term if same as previous term
      		distinctUntilChanged(),

      		// switch to new search observable each time the term changes
      		switchMap((term: string) => this.searchVehicles(term, this.vehicles)),
    	);
	}
  
	searchVehicles(term: string, vins: Observable<Vehicle[]>): Observable<Vehicle[]> {
		let vinarray: Vehicle[] = [];
		vins.subscribe(vehicles => {
			for (let v of vehicles) {
				if (v.vin.toString().includes(`${term}`)){
					vinarray.push(v);
				}
		}});
		return of(vinarray);
	}
}



