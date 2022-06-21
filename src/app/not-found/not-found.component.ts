import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  imagePath : string;

  constructor() { }

  ngOnInit(): void {
    let randomNum =Math.floor(Math.random()*2);
    switch(randomNum){
      case 0:
        this.imagePath = "../../assets/images/baby-dino.svg";
        break;
      default:
        this.imagePath = "../../assets/images/dino-fossil.svg"
    }
  }

}
