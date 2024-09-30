import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationModalData, ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { Sprinkler } from '../settings.dto';
import { SprinklersStore } from '../sprinklers.store';

@Component({
	selector: 'app-sprinkler-modal',
	templateUrl: './sprinkler-modal.component.html',
	styleUrl: './sprinkler-modal.component.scss'
})
export class SprinklerModalComponent {
	modes = SprinklerModalMode;
	mode: SprinklerModalMode;
	title: string;
	form: FormGroup;
	fields = FormField;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: { mode: SprinklerModalMode; sprinkler?: Sprinkler },
		private dialogRef: MatDialogRef<SprinklerModalComponent>,
		private dialog: MatDialog,
		private store: SprinklersStore,
		fb: FormBuilder,
	) {
		if (data.mode === SprinklerModalMode.Edit && !data.sprinkler)
			throw Error("No sprinkler to edit");

		this.mode = data.mode;

		this.title =
			this.mode === SprinklerModalMode.Add
				? 'Dodaj zraszacz'
				: 'Edytuj zraszacz';

		this.form = fb.group({
			[FormField.name]: fb.control(
				data.sprinkler?.name,
				Validators.required
			),
			[FormField.pinNumber]: fb.control(
				data.sprinkler?.pinNumber,
				[Validators.required, Validators.max(8), Validators.min(0), this.forbiddenValuesValidator]
			),
		});
	}

	save(): void {
		if (!this.form.valid)
			return;

		const name = this.form.get(FormField.name)!.value;
		const pinNumber = this.form.get(FormField.pinNumber)!.value;

		if (this.mode === SprinklerModalMode.Add) {
			this.store.create(name, pinNumber).subscribe();
		} else if (this.mode === SprinklerModalMode.Edit && this.form.dirty) {
			this.store.edit(this.data.sprinkler!.id, name, pinNumber).subscribe();
		}

		this.dialogRef.close();
	}

	delete(): void {
		const data: ConfirmationModalData = {
			content: `Czy na pewno chcesz usunąć zraszacz "${this.data.sprinkler!.name}"`,
			confirmationColor: 'warn',
			title: 'Usuń zraszacz',
		};

		this.dialog
			.open(ConfirmationModalComponent, {
				data,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.store.delete(this.data.sprinkler!.id).subscribe();
					this.dialogRef.close();
				}
			});
	}

	forbiddenValuesValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;

			if (this.store.items.map(x => x.pinNumber).includes(value)) {
				return { forbiddenValue: { value } };
			}

			return null;
		};
	}
}

export enum SprinklerModalMode {
	Add,
	Edit,
}

enum FormField {
	name = 'name',
	pinNumber = 'pinNumber',
}
