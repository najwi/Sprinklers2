import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprinkler } from './settings.dto';
import { SprinklersStore } from './sprinklers.store';
import { MatDialog } from '@angular/material/dialog';
import { SprinklerModalComponent, SprinklerModalMode } from './sprinkler-modal/sprinkler-modal.component';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
	constructor(public readonly sprinklersStore: SprinklersStore, private readonly dialog: MatDialog) {
	}

	editSprinkler(sprinkler: Sprinkler, $event: Event) {
		$event.stopPropagation();
		this.dialog.open(SprinklerModalComponent, {
			data: { mode: SprinklerModalMode.Edit, sprinkler },
		});
	}

	addSprinkler() {
		this.dialog.open(SprinklerModalComponent, {
			data: { mode: SprinklerModalMode.Add },
		});
	}
}
