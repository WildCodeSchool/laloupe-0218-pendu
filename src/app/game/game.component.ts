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
        if (this.room.word) {
          this.room.word = this.room.word.toUpperCase();
        }
      });
    });
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
