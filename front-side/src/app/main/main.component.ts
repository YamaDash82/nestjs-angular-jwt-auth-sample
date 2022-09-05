import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <p>
      main works!
    </p>
  `,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
