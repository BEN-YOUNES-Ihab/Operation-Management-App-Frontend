import { Component, OnInit } from '@angular/core';
import { Board } from '../models/boards.model';
import { Column } from '../models/column.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-sample-body-content',
  templateUrl: './sample-body-content.component.html',
  styleUrls: ['./sample-body-content.component.scss']
})
export class SampleBodyContentComponent implements OnInit {

  constructor() { }

  board: Board = new Board('Test Board', [
    new Column('Next Up', [
      "[Memoji] - Create Prototype Mobile for Get Notification",
      "[OWW] - Draw & animate illustration for OWW",
      "[Metaco] - Create draft design for User Journey earning coin"
    ]),
    new Column('In Progress', [
      "[Lux] - Design Lux Pet Sop Product Page Responsive Website",
      "[OWW] - Learn SVGator for Creating OWW Animation"
    ]),
    new Column('Complete', [
      "[Metaco] - Benchmark Mobile Legend on Earning",
      "[OWW] - Learn SVGator for Creating OWW Animation"
    ])
  ]);

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


}