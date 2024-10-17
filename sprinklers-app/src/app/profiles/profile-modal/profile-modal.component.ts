import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { Profile } from "../profiles.dto";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
	ConfirmationModalComponent,
	ConfirmationModalData,
} from "src/app/shared/confirmation-modal/confirmation-modal.component";
import { v4 as uuidv4 } from "uuid";
import { ProfilesStore } from "../profiles.store";

@Component({
	selector: "app-profile-modal",
	templateUrl: "./profile-modal.component.html",
	styleUrls: ["./profile-modal.component.scss"],
})
export class ProfileModalComponent {
	modes = PorfileModalMode;
	mode: PorfileModalMode;
	title: string;
	form: FormGroup;
	fields = FormField;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: { mode: PorfileModalMode; profile?: Profile },
		private dialogRef: MatDialogRef<ProfileModalComponent>,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private profilesStore: ProfilesStore,
	) {
		this.mode = data.mode;

		this.title =
			this.mode === PorfileModalMode.Add
				? "Dodaj profil"
				: "Edytuj profil";

		this.form = fb.group({
			[FormField.name]: fb.control(
				data.profile?.name,
				Validators.required,
			),
			[FormField.isActive]: fb.control(
				data.profile?.isActive ?? false,
				Validators.required,
			),
		});
	}

	save() {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		if (this.mode === PorfileModalMode.Add) {
			const profile: Profile = {
				id: uuidv4(),
				isActive: this.form.get(FormField.isActive)!.value,
				name: this.form.get(FormField.name)!.value,
				rules: [],
			};
			this.profilesStore
				.create(profile)
				.subscribe((x) => this.dialogRef.close());
		} else {
			const profile = this.data.profile!;
			profile.isActive = this.form.get(FormField.isActive)!.value;
			profile.name = this.form.get(FormField.name)!.value;
			this.profilesStore
				.edit(profile)
				.subscribe((x) => this.dialogRef.close());
		}
	}

	delete(): void {
		const data: ConfirmationModalData = {
			content: `Czy na pewno chcesz usunąć profil "${this.data.profile?.name}"`,
			confirmationColor: "warn",
			title: "Usuń profil",
		};

		this.dialog
			.open(ConfirmationModalComponent, {
				data,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.profilesStore
						.delete(this.data.profile!.id)
						.subscribe((x) => this.dialogRef.close());
				}
			});
	}
}

export enum PorfileModalMode {
	Add,
	Edit,
}

enum FormField {
	name = "name",
	isActive = "isActive",
}
