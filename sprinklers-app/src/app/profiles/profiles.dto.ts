export interface Profile {
	id: string;
	name: string;
	isActive: boolean;
	rules: Rule[];
}

export interface Rule {
	sprinklerId: string;
	name: string;
	isActive: boolean;
	startTime: string;
	endTime: string;
	isManualOn: boolean;
	manualTime: string;
}
