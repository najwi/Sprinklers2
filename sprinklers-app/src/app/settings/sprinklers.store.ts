import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Sprinkler } from "./settings.dto";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SprinklersStore {
    readonly items$: Observable<Sprinkler[]>;
    items: Sprinkler[] = [];
    private readonly itemsSubject: BehaviorSubject<Sprinkler[]>;

    constructor(private httpClient: HttpClient) {
        this.itemsSubject = new BehaviorSubject<Sprinkler[]>([]);
        this.items$ = this.itemsSubject.pipe(tap(x => this.items = x));

        this.itemsSubject.next([
            {
                id: 'f123121',
                name: 'sprinklername1',
                pinNumber: 2
            },
            {
                id: 'wd3e4wwqe',
                name: 'sprinklername2',
                pinNumber: 3
            }
        ])
    }
}