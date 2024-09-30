import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Profile, Rule } from './profiles.dto';
import { MatDialog } from '@angular/material/dialog';
import {
	PorfileModalMode,
	ProfileModalComponent,
} from './profile-modal/profile-modal.component';
import { RuleModalComponent, RuleModalMode } from './rule-modal/rule-modal.component';
import { ProfilesStore } from './profiles.store';

@Component({
	selector: 'app-profiles',
	templateUrl: './profiles.component.html',
	styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent {
	constructor(private readonly dialog: MatDialog, public readonly profilesStore: ProfilesStore, private fb: FormBuilder) {
	}

	setManualOn(ruleIdx: number, $event: MouseEvent) {
		$event.stopPropagation();
	}
	setManualOff(ruleIdx: number, $event: MouseEvent) {
		$event.stopPropagation();
	}

	profileCheckboxClicked(id: string, $event: Event) {
		$event.stopPropagation();
		const profile = this.profilesStore.items.find(x => x.id === id);
		if (!profile) {
			console.error('Profile not found');
			return;
		}
		profile.isActive = !profile.isActive;
		this.profilesStore.edit(profile).subscribe();
	}

	ruleCheckboxClicked(profileId: string, ruleIdx: number, $event: Event) {
		$event.stopPropagation();
		const profile = this.profilesStore.items.find(x => x.id === profileId);
		const rule = profile?.rules[ruleIdx];
		if (!rule) {
			console.error('Rule not found');
			return;
		}

		rule.isActive = !rule.isActive;
		this.profilesStore.edit(profile!).subscribe();
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

	openAddRuleModal(profile: Profile): void {
		this.dialog.open(RuleModalComponent, {
			data: { mode: RuleModalMode.Add, profile: profile },
		});
	}

	openEditRuleModal(rule: Rule, profile: Profile, ruleIdx: number, $event: Event): void {
		$event.stopPropagation();
		this.dialog.open(RuleModalComponent, {
			data: { mode: RuleModalMode.Edit, rule: rule, ruleIdx: ruleIdx, profile: profile },
		});
	}
}