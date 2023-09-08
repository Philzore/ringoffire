import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  game: Game;
  gameId: string;
  gameOver:boolean = false ;

  item$: Observable<any>;
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    const itemCollection = collection(this.firestore, 'games'); //collection ist todos , welcher er sich aus dem firestore holen soll
    this.item$ = collectionData(itemCollection); // holt aus der collection die daten in dem falle ein json array


  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.item$.subscribe(() => { //subscribe ist abbonnieren , funktion wird nun jedesmal aufgerufen , wenn die daten sich ändern
        this.getData(params['id']);

      });
    });
  }

  newGame() {
    this.game = new Game();
  }

  async getData(id: string) {
    const docRef = doc(this.firestore, 'games', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let game = docSnap.data();

      this.game.currenPlayer = game['currentPlayer'];
      this.game.playedCards = game['playedCards'];
      this.game.players = game['players'];
      this.game.playerImages = game['playerImages'];
      this.game.stack = game['stack'];
      this.game.pickCardAnimation = game['pickCardAnimation'];
      this.game.currentCard = game['currentCard'];
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

  }

  addToDatabase() {
    const itemCollection = collection(this.firestore, 'games');
    setDoc(doc(itemCollection), (this.game.toJson())); //fügt der collection was hinzu ; und in welches Feld
  }

  pickCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop() as string;
        this.game.pickCardAnimation = true;
        this.game.currenPlayer++;
        this.game.currenPlayer = this.game.currenPlayer % this.game.players.length;
        this.saveGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('person.png');
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const gameRef = doc(this.firestore, "games", this.gameId);

    await updateDoc(gameRef, (this.game.toJson()));
  }

  editPlayer(playerId: number) {
    console.log(playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Recieved change', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.playerImages.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }
}



