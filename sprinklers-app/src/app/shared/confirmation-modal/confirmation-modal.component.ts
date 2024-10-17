import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationModalData {
	content: string;
	confirmationColor?: 'accent' | 'primary' | 'warn';
	title?: string;
}

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: ConfirmationModalData,
	) {
		data.confirmationColor ??= 'accent';
	}
}
