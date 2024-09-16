import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprinkler } from './settings.dto';
import { SprinklersStore } from './sprinklers.store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public readonly sprinklersStore: SprinklersStore) {
  }

  editSprinkler() {
    
  }

  addSprinkler() {
    
  }
}
