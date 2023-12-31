export class Game {
    public players: string[] = [] ;
    public playerImages: string[] = [] ;
    public stack: string[] = [] ;
    public playedCards: string[] = [] ;
    public currenPlayer: number = 0 ;

    public pickCardAnimation = false;
    public currentCard: string = '';

    constructor() {
        for (let i = 1; i < 14; i++) { //14
            this.stack.push(`ace_${i}`);
            this.stack.push(`clubs_${i}`);
            this.stack.push(`diamonds_${i}`);
            this.stack.push(`hearts_${i}`);
        }
        shuffle(this.stack) ;
    }

    public toJson() {
        return {
            players : this.players,
            playerImages : this.playerImages,
            stack : this.stack,
            playedCards : this.playedCards,
            currentPlayer : this.currenPlayer,
            pickCardAnimation : this.pickCardAnimation,
            currentCard : this.currentCard
        };
    }
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }