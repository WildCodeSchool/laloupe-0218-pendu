import { AuthService } from './../auth.service';
import { Player } from './../model/player';
import { Room } from './../model/room';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  dictionary;
  authId: string;
  private authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore,
    private afs: AngularFirestore,
    private router: Router) { }

  ngOnInit() {
    this.authSubscription = this.authService.authState.take(1).subscribe((user) => {
      if (user) {
        this.getRooms();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  getRooms() {
    const roomsCollection = this.db.collection<Room>('rooms');

    const snapshot = roomsCollection.snapshotChanges().take(1).subscribe((snap) => {
      const player = new Player();
      player.name = this.authService.name;
      player.id = this.authService.authId;
      for (const snapshotItem of snap) {
        const roomId = snapshotItem.payload.doc.id;
        const room = snapshotItem.payload.doc.data() as Room;

        console.log(Object.keys(room.players));
        if (Object.keys(room.players).length === 1) {
          room.players[1] = player;
          console.log(room.players);
          this.setupRoom(room, roomId);
          return;
        }
      }

      const newRoom = new Room();
      newRoom.players = [player];
      this.db.collection('rooms')
        .add(JSON.parse(JSON.stringify(newRoom)))
        .then((doc) => {
          this.router.navigate(['game', doc.id]);
        });
    });
  }

  setupRoom(room, roomId) {
    room.players[0].remainingTries = 13;
    room.players[0].score = 0;
    room.players[1].remainingTries = 13;
    room.players[1].score = 0;

    this.afs.doc<Room>('rooms/' + roomId).set(JSON.parse(JSON.stringify(room))).then(() => {
      this.afs.doc('dictionary/61mUBkjCZL7TBF2CPueq').valueChanges().subscribe((dictionary) => {
        this.dictionary = dictionary;
        this.setWord(room, roomId);
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
}
