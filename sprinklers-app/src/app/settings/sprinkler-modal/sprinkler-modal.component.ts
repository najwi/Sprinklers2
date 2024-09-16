import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationModalData, ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { Sprinkler } from '../settings.dto';

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
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
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
        [Validators.required, Validators.max(8), Validators.min(0)]
      ),
    });
  }

  delete(): void {
    const data: ConfirmationModalData = {
      content: `Czy na pewno chcesz usunąć zraszacz "${this.data.sprinkler?.name}"`,
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
          //todo delete
          this.dialogRef.close();
        }
      });
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
