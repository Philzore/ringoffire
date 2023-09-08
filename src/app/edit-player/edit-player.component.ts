import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
allProfilePicture = ['person.png','user_female.png','support.png','pinguin.png','female_2.png'] ;

constructor(
  public dialogRef: MatDialogRef<DialogAddPlayerComponent>
) { }

selectPicture(picture) {
  
}

}
