import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headercomponent = 'Entered in new component created';
  constructor() { }

  ngOnInit() {
  }

}
