import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Sprinkler } from "./settings.dto";
import { ApiService } from "../api.service";
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SprinklersStore {
    readonly items$: Observable<Sprinkler[]>;
    private readonly itemsSubject: BehaviorSubject<Sprinkler[]>;

    constructor(private readonly api: ApiService, private readonly snackBar: MatSnackBar) {
        this.itemsSubject = new BehaviorSubject<Sprinkler[]>([]);
        this.items$ = this.itemsSubject.asObservable();
        this.api.getSprinklers().subscribe(items => this.itemsSubject.next(items));
    }

    get items(): Sprinkler[] {
        return this.itemsSubject.value;
    }

    delete(id: string): Observable<void> {
        return this.api.deleteSprinkler(id).pipe(
            tap(() => {
                this.itemsSubject.next(this.items.filter(x => x.id !== id));
                this.showSuccess();
            })
        );
    }

    create(name: string, pinNumber: number): Observable<void> {
        const item: Sprinkler = {
            id: uuidv4(),
            name: name,
            pinNumber: pinNumber
        }
        return this.api.postSprinkler(item).pipe(
            tap(() => {
                this.itemsSubject.next([...this.items, item]);
                this.showSuccess();
            })
        )
    }

    edit(id: string, name: string, pinNumber: number): Observable<void> {
        return this.api.putSprinkler(id, name, pinNumber).pipe(
            tap(() => {
                const index = this.items.findIndex(x => x.id === id)
                this.items[index].name = name;
                this.items[index].pinNumber = pinNumber;
                this.itemsSubject.next(this.items);
                this.showSuccess();
            })
        )
    }

    private showSuccess() {
        this.snackBar.open("Akcja wykonana pomyślnie", "OK", {duration: 5000});
    }
}