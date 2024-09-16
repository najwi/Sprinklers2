import { Sprinkler } from "../settings/settings.dto";

export interface Profile {
	name: string;
	isActive: boolean;
	rules: Rule[];
}

export interface Rule {
    sprinkler: Sprinkler;
	name: string;
	isActive: boolean;
	startTime: string;
	endTime: string;
    isManualOn: boolean;
    manualTime: string;
}
