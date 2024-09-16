import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Profile, Rule } from './profiles.dto';
import { MatDialog } from '@angular/material/dialog';
import {
	PorfileModalMode,
	ProfileModalComponent,
} from './profile-modal/profile-modal.component';
import { RuleModalComponent, RuleModalMode } from './rule-modal/rule-modal.component';

@Component({
	selector: 'app-profiles',
	templateUrl: './profiles.component.html',
	styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent {
	control: FormControl = new FormControl(true);

	profiles: Profile[] = [
		{
			name: 'Profil 1',
			isActive: true,
			rules: [
				{
					name: 'Zgorzelcka',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: true,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
				{
					name: 'srodek',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: false,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem ",
						pinNumber: 1
					}
				},
				{
					name: 'Za mostkiem',
					isActive: false,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: false,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
			],
		},
		{
			name: 'Profil 2',
			isActive: false,
			rules: [
				{
					name: 'Zgorzelcka',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: true,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
				{
					name: 'srodek',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					manualTime: "1",
					isManualOn: false,
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
				{
					name: 'Za mostkiem',
					isActive: false,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: false,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
			],
		},
		{
			name: 'Profil 3',
			isActive: true,
			rules: [
				{
					name: 'Zgorzelcka',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: true,
					manualTime: "1",
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
				{
					name: 'srodek',
					isActive: true,
					startTime: '10:15',
					endTime: '10:30',
					manualTime: "1",
					isManualOn: false,
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
				{
					name: 'Za mostkiem',
					manualTime: "1",
					isActive: false,
					startTime: '10:15',
					endTime: '10:30',
					isManualOn: false,
					sprinkler: {
						id: "f123121",
						name: "Za mostkiem",
						pinNumber: 1
					}
				},
			],
		},
	];

	constructor(public dialog: MatDialog) {
		console.log(window.location.origin);
	}

	openAddProfileModal(): void {
		this.dialog.open(ProfileModalComponent, {
			data: { mode: PorfileModalMode.Add },
		});
	}

	openEditProfileModal(profile: Profile, $event: Event): void {
		$event.stopPropagation();
		this.dialog.open(ProfileModalComponent, {
			data: { mode: PorfileModalMode.Edit, profile },
		});
	}

	openAddRuleModal(): void {
		this.dialog.open(RuleModalComponent, {
			data: { mode: RuleModalMode.Add },
		});
	}

	openEditRuleModal(rule: Rule, $event: Event): void {
		$event.stopPropagation();
		this.dialog.open(RuleModalComponent, {
			data: { mode: RuleModalMode.Edit, rule },
		});
	}
}
