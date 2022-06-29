import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  name: string = "";
  email: string = "";
  subject: string = "";
  message: string = "";
  isFormValid: boolean;
  isNameValid: boolean;
  isEmailValid: boolean;
  isMessageValid: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isFormValid = true;
    this.isEmailValid = true;
    this.isNameValid = true;
    this.isMessageValid = true;
  }

  submit(): void{
    this.isNameValid = this.name != "";
    this.isEmailValid = this.email != "";
    this.isMessageValid = this.message != "";

    if(this.name && this.email && this.subject && this.message){
      // send email
    }
    else{
    }

  }

  optionChanged(): void{
    this.isNameValid = this.name != "";
    this.isEmailValid = this.email != "";
    this.isMessageValid = this.message != "";
  }

}
