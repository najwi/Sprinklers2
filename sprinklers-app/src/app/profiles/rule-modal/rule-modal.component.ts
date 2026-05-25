import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialog,
} from "@angular/material/dialog";
import { ProfileModalComponent } from "../profile-modal/profile-modal.component";
import { Profile, Rule } from "../profiles.dto";
import { SprinklersStore } from "src/app/settings/sprinklers.store";
import { Observable } from "rxjs";
import { Sprinkler } from "src/app/settings/settings.dto";
import { NgxMaterialTimepickerTheme } from "ngx-material-timepicker";
import {
	ConfirmationModalComponent,
	ConfirmationModalData,
} from "src/app/shared/confirmation-modal/confirmation-modal.component";
import { ProfilesStore } from "../profiles.store";
import { toSeconds, toTime } from "src/app/shared/time-helper";

@Component({
	selector: "app-rule-modal",
	templateUrl: "./rule-modal.component.html",
	styleUrls: ["./rule-modal.component.scss"],
})
export class RuleModalComponent {
	modes = RuleModalMode;
	mode: RuleModalMode;
	title: string;
	form: FormGroup;
	fields = FormField;

	sprinklers$: Observable<Sprinkler[]>;

	timePickerTheme!: NgxMaterialTimepickerTheme;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: {
			mode: RuleModalMode;
			rule?: Rule;
			profile?: Profile;
			ruleIdx?: number;
		},
		private dialogRef: MatDialogRef<ProfileModalComponent>,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private sprinklers: SprinklersStore,
		private profilesStore: ProfilesStore,
	) {
		this.mode = data.mode;
		this.sprinklers$ = sprinklers.items$;
		this.setTheme();

		this.title =
			this.mode === RuleModalMode.Add ? "Dodaj regułę" : "Edytuj regułę";

		this.form = fb.group({
			[FormField.sprinklerId]: fb.control(
				data.rule?.sprinklerId,
				Validators.required,
			),
			[FormField.name]: fb.control(data.rule?.name, Validators.required),
			[FormField.isActive]: fb.control(
				data.rule?.isActive ?? false,
				Validators.required,
			),
			[FormField.startTime]: fb.control(
				toTime(data.rule?.startTime),
				Validators.required,
			),
			[FormField.endTime]: fb.control(
				toTime(data.rule?.endTime),
				Validators.required,
			),
			[FormField.manualDuration]: fb.control(
				data.rule?.manualDuration ? data.rule.manualDuration / 60 : 5,
				[Validators.required, Validators.min(1)],
			),
			[FormField.dayInterval]: fb.control(
				data.rule?.dayInterval ?? 1,
				[Validators.required, Validators.min(1)],
			),
		});

		this.form
			.get(FormField.sprinklerId)
			?.valueChanges.subscribe((value) => {
				if (!value) return;
				const nameControl = this.form.get(FormField.name);
				if (nameControl?.value) return;

				const name = sprinklers.items.find((x) => x.id === value)?.name;
				nameControl?.patchValue(`Reguła ${name}`);
			});
	}

	get showTooltip(): boolean {
		return !this.form.get(FormField.name)?.value;
	}

	save(): void {
		this.form.markAllAsTouched();
		if (this.form.invalid) return;

		const rule: Rule = {
			isActive: this.form.get(FormField.isActive)!.value,
			endTime: toSeconds(
				this.form.get(FormField.endTime)!.value,
			) as number,
			startTime: toSeconds(
				this.form.get(FormField.startTime)!.value,
			) as number,
			manualDuration: this.form.get(FormField.manualDuration)!.value * 60,
			name: this.form.get(FormField.name)!.value,
			sprinklerId: this.form.get(FormField.sprinklerId)!.value,
			manualStartTime: this.data.rule?.manualStartTime ?? -1,
			dayInterval: this.form.get(FormField.dayInterval)!.value,
		};

		const profile = this.data.profile!;

		if (this.mode === RuleModalMode.Add) {
			profile.rules = [...profile.rules, rule];
		} else {
			profile.rules[this.data.ruleIdx!] = rule;
		}

		this.profilesStore
			.edit(profile)
			.subscribe((x) => this.dialogRef.close());
	}

	delete(): void {
		const data: ConfirmationModalData = {
			content: `Czy na pewno chcesz usunąć regułę "${this.data.rule?.name}"`,
			confirmationColor: "warn",
			title: "Usuń regułę",
		};

		this.dialog
			.open(ConfirmationModalComponent, {
				data,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					const profile = this.data.profile!;
					profile.rules = profile.rules.filter(
						(_, idx) => idx !== this.data.ruleIdx,
					);
					this.profilesStore
						.edit(profile)
						.subscribe((x) => this.dialogRef.close());
				}
			});
	}

	private setTheme(): void {
		const accentColor = "#ff4081";
		const primaryColor = "#3f51b5";

		this.timePickerTheme = {
			clockFace: { clockHandColor: accentColor },
			dial: { dialBackgroundColor: primaryColor },
			container: { buttonColor: primaryColor },
		};
	}
}

export enum FormField {
	name = "name",
	isActive = "isActive",
	sprinklerId = "sprinklerId",
	startTime = "startTime",
	endTime = "endTime",
	manualDuration = "manualDuration",
	dayInterval = "dayInterval",
}

export enum RuleModalMode {
	Add,
	Edit,
}
