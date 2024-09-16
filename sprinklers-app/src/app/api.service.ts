import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sprinkler } from './settings/settings.dto';

@Injectable({ providedIn: 'root' })
export class ApiService {
    baseUrl = window.location.origin;
    constructor(private readonly httpClient: HttpClient) { }

    getSprinklers(): Observable<Sprinkler[]> {
        return this.httpClient.get<Sprinkler[]>(`${this.baseUrl}/sprinklers`);
    }

    deleteSprinkler(id: string): Observable<void> {
        return this.httpClient.delete<never>(`${this.baseUrl}/sprinklers/${id}`)
    }

    postSprinkler(name: string, pinNumber: number): Observable<Sprinkler> {
        return this.httpClient.post<Sprinkler>(`${this.baseUrl}/sprinklers`, { name, pinNumber });
    }

    putSprinkler(id: string, name: string, pinNumber: number): Observable<Sprinkler> {
        return this.httpClient.put<Sprinkler>(`${this.baseUrl}/sprinklers/${id}`, { name, pinNumber });
    }
}