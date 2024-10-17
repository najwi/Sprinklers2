import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Profile, Rule } from "./profiles.dto";
import { MatDialog } from "@angular/material/dialog";
import {
	PorfileModalMode,
	ProfileModalComponent,
} from "./profile-modal/profile-modal.component";
import {
	RuleModalComponent,
	RuleModalMode,
} from "./rule-modal/rule-modal.component";
import { ProfilesStore } from "./profiles.store";
import { toTime } from "../shared/time-helper";
import { ApiService } from "../api.service";
import { combineLatest, first } from "rxjs";

@Component({
	selector: "app-profiles",
	templateUrl: "./profiles.component.html",
	styleUrls: ["./profiles.component.scss"],
})
export class ProfilesComponent implements OnInit, OnDestroy {
	activeTimeouts: { [name: string]: any } = {};
	toTime = toTime;
	expansionPanelStates: { [index: number]: boolean } = {};

	constructor(
		private readonly dialog: MatDialog,
		public readonly profilesStore: ProfilesStore,
		private fb: FormBuilder,
		private api: ApiService,
	) {}

	ngOnDestroy(): void {
		Object.values(this.activeTimeouts)?.forEach((x) => clearTimeout(x));
	}

	ngOnInit(): void {
		combineLatest({
			profiles: this.profilesStore.items$,
			time: this.api.getTime(),
		})
			.pipe(first())
			.subscribe(({ profiles, time }) => {
				console.log("Current time:", toTime(time));

				profiles.forEach((profile) => {
					for (let index = 0; index < profile.rules.length; index++) {
						const rule = profile.rules[index];
						if (rule.manualStartTime !== -1) {
							const timeoutTime =
								(rule.manualDuration +
									rule.manualStartTime -
									time) *
								1000;
							if (timeoutTime < 0) continue;
							this.activeTimeouts[profile.id + index] =
								setTimeout(() => {
									console.log("Timeout fired");
									rule.manualStartTime = -1;
								}, timeoutTime);
						}
					}
				});
			});
	}

	setManualOn(profile: Profile, ruleIdx: number, $event: MouseEvent) {
		$event.stopPropagation();
		const rule = profile?.rules[ruleIdx];
		if (!rule) {
			console.error("Rule not found");
			return;
		}

		rule.manualStartTime = -2;
		this.profilesStore.edit(profile, true).subscribe();

		this.activeTimeouts[profile.id + ruleIdx] = setTimeout(() => {
			console.log("Timeout fired");
			rule.manualStartTime = -1;
		}, rule.manualDuration * 1000);
	}

	setManualOff(profile: Profile, ruleIdx: number, $event: MouseEvent) {
		$event.stopPropagation();
		const rule = profile?.rules[ruleIdx];
		if (!rule) {
			console.error("Rule not found");
			return;
		}

		const timeoutId = this.activeTimeouts[profile.id + ruleIdx];
		if (timeoutId) clearTimeout(timeoutId);

		rule.manualStartTime = -1;
		this.profilesStore.edit(profile).subscribe();
	}

	profileCheckboxClicked(profile: Profile, $event: Event) {
		$event.stopPropagation();
		if (!profile) {
			console.error("Profile not found");
			return;
		}
		profile.isActive = !profile.isActive;
		this.profilesStore.edit(profile).subscribe();
	}

	ruleCheckboxClicked(profile: Profile, ruleIdx: number, $event: Event) {
		$event.stopPropagation();
		const rule = profile?.rules[ruleIdx];
		if (!rule) {
			console.error("Rule not found");
			return;
		}

		rule.isActive = !rule.isActive;
		this.profilesStore.edit(profile).subscribe();
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

	openEditRuleModal(
		rule: Rule,
		profile: Profile,
		ruleIdx: number,
		$event: Event,
	): void {
		$event.stopPropagation();
		this.dialog.open(RuleModalComponent, {
			data: {
				mode: RuleModalMode.Edit,
				rule: rule,
				ruleIdx: ruleIdx,
				profile: profile,
			},
		});
	}

	calculateTimeDiff(rule: Rule): number {
		if (rule.startTime <= rule.endTime) {
			return (rule.endTime - rule.startTime) / 60;
		} else {
			return (rule.endTime + 86400 - rule.startTime) / 60;
		}
	}
}
