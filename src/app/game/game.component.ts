import { KeyboardComponent } from './../keyboard/keyboard.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Room } from './../model/room';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import { Player } from '../model/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  room: Room;
  authId: string;
  @ViewChild(KeyboardComponent) keyboard: KeyboardComponent;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.take(1).subscribe((authState) => {
      this.authId = authState.uid;
      this.afs.doc<Room>('rooms/61mUBkjCZL7TBF2CPueq').valueChanges().subscribe((room) => {
        this.room = room;
        if (!this.room) {
          this.generateRoom();
        }
      });
    });
  }

  ngAfterViewInit() {
    console.log(this.keyboard);
    this.keyboard.consumeLetters((letter) => {
      console.log(letter);
      this.keyEntered(letter);
    });
  }

  keyEntered(letter) {
    let i = 0;
    while (i < this.room.word.length) {
      if (this.room.word[i] === letter) {
        this.me.playingWord[i] = letter;
      }
      i++;
    }
  }

  generateRoom() {
    const room = new Room();
    room.word = 'POLICE';
    room.players = [new Player(), new Player()];
    room.players[0].id = 'qQ1ASzR4KTRsCWnyz9umaEmOkEA3';
    room.players[0].name = 'Player1';
    room.players[0].remainingTries = 13;
    room.players[0].score = 0;
    room.players[0].playingWord = new Array(room.word.length);
    room.players[1].id = '5al53GPek1ZujkFco40srjNLOVV2';
    room.players[1].name = 'Player2';
    room.players[1].remainingTries = 13;
    room.players[1].score = 0;
    room.players[1].playingWord = new Array(room.word.length);
    this.afs.doc<Room>('rooms/61mUBkjCZL7TBF2CPueq').set(JSON.parse(JSON.stringify(room))).then(() => {
      console.log('Room updated');
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
