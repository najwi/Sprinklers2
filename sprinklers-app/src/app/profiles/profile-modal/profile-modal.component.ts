import { Component, Inject, OnInit } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from '@angular/material/dialog';
import { Profile } from '../profiles.dto';
import {
	Form,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import {
	ConfirmationModalComponent,
	ConfirmationModalData,
} from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
	selector: 'app-profile-modal',
	templateUrl: './profile-modal.component.html',
	styleUrls: ['./profile-modal.component.scss'],
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
		private dialog: MatDialog
	) {
		this.mode = data.mode;

		this.title =
			this.mode === PorfileModalMode.Add
				? 'Dodaj profil'
				: 'Edytuj profil';

		this.form = fb.group({
			[FormField.name]: fb.control(
				data.profile?.name,
				Validators.required
			),
			[FormField.isActive]: fb.control(
				data.profile?.isActive ?? false,
				Validators.required
			),
		});
	}

	delete(): void {
		const data: ConfirmationModalData = {
			content: `Czy na pewno chcesz usunąć profil "${this.data.profile?.name}"`,
			confirmationColor: 'warn',
			title: 'Usuń profil',
		};

		this.dialog
			.open(ConfirmationModalComponent, {
				data,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					//todo delete
					this.dialogRef.close();
				}
			});
	}
}

export enum PorfileModalMode {
	Add,
	Edit,
}

enum FormField {
	name = 'name',
	isActive = 'isActive',
}
