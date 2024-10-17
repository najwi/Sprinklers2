import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ApiService } from "../api.service";
import { Profile } from "./profiles.dto";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
	providedIn: "root",
})
export class ProfilesStore {
	readonly items$: Observable<Profile[]>;
	private readonly itemsSubject: BehaviorSubject<Profile[]>;

	constructor(
		private readonly api: ApiService,
		private readonly snackBar: MatSnackBar,
	) {
		this.itemsSubject = new BehaviorSubject<Profile[]>([]);
		this.items$ = this.itemsSubject.asObservable();
		this.updateItems();
	}

	private updateItems() {
		this.api
			.getProfiles()
			.subscribe((items) => this.itemsSubject.next(items));
	}

	get items(): Profile[] {
		return this.itemsSubject.value;
	}

	delete(id: string): Observable<void> {
		return this.api.deleteProfile(id).pipe(
			tap(() => {
				this.itemsSubject.next(this.items.filter((x) => x.id !== id));
				this.showSuccess();
			}),
		);
	}

	create(profile: Profile): Observable<void> {
		return this.api.postProfile(profile).pipe(
			tap(() => {
				this.itemsSubject.next([...this.items, profile]);
				this.showSuccess();
			}),
		);
	}

	edit(profile: Profile, updateItems: boolean = false): Observable<void> {
		return this.api.putProfile(profile).pipe(
			tap(() => {
				const index = this.items.findIndex((x) => x.id === profile.id);
				this.items[index] = profile;
				this.itemsSubject.next(this.items);
				this.showSuccess();

				if (updateItems) this.updateItems();
			}),
		);
	}

	private showSuccess() {
		this.snackBar.open("Akcja wykonana pomyślnie", "OK", {
			duration: 5000,
		});
	}
}
