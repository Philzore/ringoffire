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

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;

  item$: Observable<any>;
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    const itemCollection = collection(this.firestore, 'games'); //collection ist todos , welcher er sich aus dem firestore holen soll
    this.item$ = collectionData(itemCollection); // holt aus der collection die daten in dem falle ein json array

    
  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {

      this.item$.subscribe((game:any) => { //subscribe ist abbonnieren , funktion wird nun jedesmal aufgerufen , wenn die daten sich ändern
        this.getData(params['id']);
        
      });
    });
  }

  newGame() {
    this.game = new Game();
    // this.addToDatabase() ;
  }

  async getData(id: string) {
    const docRef = doc(this.firestore, 'games', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let game = docSnap.data();
      
      this.game.currenPlayer = game['currentPlayer'] ;
      this.game.playedCards = game['playedCards'] ;
      this.game.players = game['players'] ;
      this.game.stack = game['stack'] ;
      console.log('Players', this.game.players);
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
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() as string;
      this.pickCardAnimation = true;

      this.game.currenPlayer++;
      this.game.currenPlayer = this.game.currenPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);

    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  async saveGame() {
    const gameRef = doc(this.firestore, "games", "DC");

    await updateDoc(gameRef, (this.game.toJson()));
  }
}

