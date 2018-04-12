import { Player } from './../model/player';
import { KeyboardComponent } from './../keyboard/keyboard.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Room } from './../model/room';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  dictionary;
  room: Room;
  authId: string;
  @ViewChild(KeyboardComponent) keyboard: KeyboardComponent;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.afAuth.authState.take(1).subscribe((authState) => {
      this.authId = authState.uid;
      this.afs.doc<Room>('rooms/znREuYkPqXHniqCNFGOc').valueChanges().subscribe((room) => {
        this.room = room;
        this.room.word = this.room.word.toUpperCase();
        if (!this.room) {
          this.generateRoom();
        }
      });
    });
  }

  SetRdmWord() {
    this.room.word = this.dictionary.words[Math.floor(Math.random() * this.dictionary.words.length)].toUpperCase();
    this.room.players[0].playingWord = new Array(this.room.word.length);
    this.room.players[0].playingWord = new Array(this.room.word.length);
    this.afs.doc<Room>('rooms/znREuYkPqXHniqCNFGOc').set(JSON.parse(JSON.stringify(this.room)));
    console.log(this.room.word);

  }

  ngAfterViewInit() {
    this.keyboard.consumeLetters((letter) => {
      this.keyEntered(letter.toUpperCase());
    });
  }

  keyEntered(letter) {
    console.log(letter);
    let i = 0;
    let emptyCases = 0;
    while (i < this.room.word.length) {
      if (this.room.word[i] === letter) {
        this.me.playingWord[i] = letter;
      }
      i += 1;
    }
    for (let idx = 0; idx < this.room.word.length; idx = idx + 1) {
      if (this.me.playingWord[idx] === null) {
        emptyCases = emptyCases + 1;
      }
      if (this.room.word[i] !== letter) {
        this.me.remainingTries = this.me.remainingTries - 1;
      }
    }
    if (emptyCases === 0) {
      this.winGame();
    }

    console.log(emptyCases);
    console.log(this.me.playingWord);
  }


  winGame() {
    alert('You win, click "OK" for being redirected at Home !');
  }

  generateRoom() {
    const room = new Room();
    room.players = [new Player(), new Player()];
    room.players[0].id = 'qQ1ASzR4KTRsCWnyz9umaEmOkEA3';
    room.players[0].name = 'Player1';
    room.players[0].remainingTries = 13;
    room.players[0].score = 0;
    room.players[1].id = '5al53GPek1ZujkFco40srjNLOVV2';
    room.players[1].name = 'Player2';
    room.players[1].remainingTries = 13;
    room.players[1].score = 0;

    this.afs.doc<Room>('rooms/znREuYkPqXHniqCNFGOc').set(JSON.parse(JSON.stringify(room))).then(() => {
      console.log('Room updated');
      this.afs.doc('dictionary/61mUBkjCZL7TBF2CPueq').valueChanges().subscribe((dictionary) => {
        this.dictionary = dictionary;
        console.log(this.dictionary);
        if (this.room) {
          this.SetRdmWord();
        }
      });
    });
  }

  get me() {
    if (this.room.players[0].id === this.authId) {
      return this.room.players[0];
    } else if (this.room.players[1].id === this.authId) {
      return this.room.players[1];
    } else {
      return null;
    }
  }

}
