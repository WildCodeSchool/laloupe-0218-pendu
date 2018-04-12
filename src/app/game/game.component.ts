import { KeyboardComponent } from './../keyboard/keyboard.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Room } from './../model/room';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { Player } from '../model/player';
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


  // sendWord() {
  //   let ArrayTest = [];
  //   let i = 0;
  //   const wordtest = 'POLICE';
  //   ArrayTest = wordtest.split('');
  //   console.log(ArrayTest);
  //   while (i < ArrayTest[i]) {
  //     if (ArrayTest[i] === wordtest) {
  //       this.me.playingWord[i] = wordtest;
  //     }
  //     i++;
  //   }
  // }

  ngAfterViewInit() {
    this.keyboard.consumeLetters((letter) => {
      this.keyEntered(letter.toUpperCase());
    });
  }

  keyEntered(letter) {
    console.log(letter);
    let i = 0;
    while (i < this.room.word.length) {

      if (this.room.word[i] === letter) {
        this.me.playingWord[i] = letter;
      }
      i++;
    }
    console.log(this.me.playingWord);
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
