import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { collection } from '@firebase/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  constructor(private router: Router) {

  }


  newGame() {
    //Start Game
    let game = new Game();
    this.addNewGameData(game) ;
  }

  async addNewGameData(game) {
    const gameRef = await addDoc(collection(this.firestore, "games"), (game.toJson()));
    console.log("Document written with ID: ", gameRef.id);
    this.router.navigateByUrl('/game/' + gameRef.id);
  }

  
}
