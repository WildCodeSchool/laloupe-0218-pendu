import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  items: Observable<any[]>;
  Dictionary: Observable<any[]>;

  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {
    this.items = this.db.collection('items').valueChanges();
    this.Dictionary = this.db.collection('Dictionary').valueChanges();
  }

}
