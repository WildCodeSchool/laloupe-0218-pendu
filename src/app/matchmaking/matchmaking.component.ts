import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { Router } from '@angular/router';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  rooms: Observable<any[]>;

  constructor(private db: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    const roomsCollection = this.db.collection('rooms');
    roomsCollection.valueChanges().take(1).subscribe(rooms => {
      console.log(rooms.length);
    });
  }
}
