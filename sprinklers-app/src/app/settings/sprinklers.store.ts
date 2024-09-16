import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Sprinkler } from "./settings.dto";
import { ApiService } from "../api.service";

@Injectable({
    providedIn: 'root'
})
export class SprinklersStore {
    readonly items$: Observable<Sprinkler[]>;
    private readonly itemsSubject: BehaviorSubject<Sprinkler[]>;

    constructor(private readonly api: ApiService) {
        this.itemsSubject = new BehaviorSubject<Sprinkler[]>([]);
        this.items$ = this.itemsSubject.asObservable();
        this.api.getSprinklers().subscribe(items => this.itemsSubject.next(items));
    }

    get items(): Sprinkler[] {
        return this.itemsSubject.value;
    }

    delete(id: string): Observable<void> {
        return this.api.deleteSprinkler(id).pipe(
            tap(() => this.itemsSubject.next(this.items.filter(x => x.id !== id)))
        );
    }

    create(name: string, pinNumber: number): Observable<Sprinkler> {
        return this.api.postSprinkler(name, pinNumber).pipe(
            tap(item => this.itemsSubject.next([...this.items, item]))
        )
    }

    edit(sprinkler: Sprinkler): Observable<Sprinkler> {
        return this.api.putSprinkler(sprinkler.id, sprinkler.name, sprinkler.pinNumber).pipe(
            tap(item => {
                const index = this.items.findIndex(x => x.id === sprinkler.id)
                this.items[index] = item;
                this.itemsSubject.next(this.items);
            })
        )
    }
}