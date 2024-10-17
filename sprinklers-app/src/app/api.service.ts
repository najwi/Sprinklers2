import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, shareReplay } from "rxjs";
import { Sprinkler } from "./settings/settings.dto";
import { Profile } from "./profiles/profiles.dto";

@Injectable({ providedIn: "root" })
export class ApiService {
	private readonly baseUrl = window.location.origin + "/api";
	constructor(private readonly httpClient: HttpClient) {}

	getSprinklers(): Observable<Sprinkler[]> {
		return this.httpClient.get<Sprinkler[]>(`${this.baseUrl}/sprinklers`);
	}

	deleteSprinkler(id: string): Observable<void> {
		return this.httpClient.delete<void>(`${this.baseUrl}/sprinklers`, {
			params: { id: id },
		});
	}

	postSprinkler(sprinkler: Sprinkler): Observable<void> {
		return this.httpClient.post<void>(
			`${this.baseUrl}/sprinklers`,
			sprinkler,
		);
	}

	putSprinkler(
		id: string,
		name: string,
		pinNumber: number,
	): Observable<void> {
		return this.httpClient.put<void>(
			`${this.baseUrl}/sprinklers`,
			{ name, pinNumber },
			{ params: { id: id } },
		);
	}

	getProfiles(): Observable<Profile[]> {
		return this.httpClient
			.get<Profile[]>(`${this.baseUrl}/profiles`)
			.pipe(shareReplay({ refCount: true, windowTime: 1000 }));
	}

	deleteProfile(id: string): Observable<void> {
		return this.httpClient.delete<void>(`${this.baseUrl}/profiles`, {
			params: { id: id },
		});
	}

	postProfile(profile: Profile): Observable<void> {
		return this.httpClient.post<void>(`${this.baseUrl}/profiles`, profile);
	}

	putProfile(profile: Profile): Observable<void> {
		return this.httpClient.put<void>(`${this.baseUrl}/profiles`, profile);
	}

	getTime(): Observable<number> {
		return this.httpClient.get<number>(`${this.baseUrl}/time`);
	}
}
