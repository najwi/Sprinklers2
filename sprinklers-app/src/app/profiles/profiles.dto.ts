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
	startTime: number; //seconds
	endTime: number; //seconds
	manualStartTime: number; //seconds -1=off, -2=signal to set on
	manualDuration: number; //seconds
	dayInterval?: number;
}
