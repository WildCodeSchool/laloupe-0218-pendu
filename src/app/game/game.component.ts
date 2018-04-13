import { Player } from './../model/player';
import { KeyboardComponent } from './../keyboard/keyboard.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Room } from './../model/room';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  static readonly TRIES_MAX = 8;

  dictionary;
  room: Room;
  roomId: string;
  authId: string;
  @ViewChild(KeyboardComponent) keyboard: KeyboardComponent;

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.afAuth.authState.take(1).subscribe((authState) => {
      this.authId = authState.uid;
      this.afs.doc<Room>('rooms/' + this.roomId).valueChanges().subscribe((room) => {
        this.room = room;
        if (this.notStarted()) {
          this.keyboard.resetKeyboard();
        }
        if (this.room.word) {
          this.room.word = this.room.word.toUpperCase();
        }
      });
    });
  }

  notStarted() {
    let letterCount = 0;
    let i = 0;
    while (i < this.me.playingWord.length) {
      if (this.me.playingWord[i] != null) {
        letterCount += 1;
      }
      i++;
    }
    return letterCount === 0 && this.me.remainingTries === GameComponent.TRIES_MAX;
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
    let success = false;
    while (i < this.room.word.length) {
      if (this.room.word[i] === letter) {
        this.me.playingWord[i] = letter;
        success = true;
      }
      i += 1;
    }
    if (!success) {
      this.me.remainingTries = this.me.remainingTries - 1;
    }
    for (let idx = 0; idx < this.room.word.length; idx = idx + 1) {
      if (this.me.playingWord[idx] === null) {
        emptyCases = emptyCases + 1;
      }
    }
    if (emptyCases === 0) {
      this.me.score += 1;
      this.setupRoom();
      alert('You win, click "OK" to start again');
    } else if (this.me.remainingTries === 0) {
      this.setupRoom();
      this.opponent.score += 1;
      alert('You loose :( , click "OK" to start again');
    }
    this.updateRoom();
  }

  updateRoom() {
    this.afs.doc<Room>('rooms/' + this.roomId).set(this.room);
  }

  setupRoom() {
    this.room.players[0].remainingTries = GameComponent.TRIES_MAX;
    this.room.players[1].remainingTries = GameComponent.TRIES_MAX;

    this.afs.doc<Room>('rooms/' + this.roomId).set(JSON.parse(JSON.stringify(this.room))).then(() => {
      this.afs.doc('dictionary/61mUBkjCZL7TBF2CPueq').valueChanges().subscribe((dictionary) => {
        this.dictionary = dictionary;
        this.setWord(this.room, this.roomId);
      });
    });
  }

  setWord(room, roomId) {
    room.word = this.dictionary.words[Math.floor(Math.random() * this.dictionary.words.length)].toUpperCase();
    room.players[0].playingWord = new Array(room.word.length);
    room.players[1].playingWord = new Array(room.word.length);
    this.afs.doc<Room>('rooms/' + roomId).set(JSON.parse(JSON.stringify(room))).then(() => {
      this.router.navigate(['game', roomId]);
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

  get opponent() {
    if (this.room.players[0].id === this.authId) {
      return this.room.players[1];
    } else if (this.room.players[1].id === this.authId) {
      return this.room.players[0];
    } else {
      return null;
    }
  }

}
