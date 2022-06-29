import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VotingService } from '../voting.service';

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
  isMessageValid: boolean;
  messageSent: boolean;
  error : boolean = false;
  statusMessage: string = "";

  constructor(private votingService : VotingService, private router : Router) { }

  ngOnInit(): void {
    this.isMessageValid = true;
    this.messageSent = false;
    this.error = false;
  }

  submit(): void{
    this.statusMessage = "";
    this.isMessageValid = this.message != "";
    this.error = false;

    if(this.message){
      this.votingService.sendMessage(this.message, this.name).then((sessionId) => {
        if(sessionId){
          this.error = false;
          this.messageSent = true;
          this.statusMessage = "Message sent.";
        }
        else{
          this.messageSent = false;
          this.error = true;
          this.statusMessage = "Error sending message. Please try again later";
        }
      });
    }
    else{
      this.isMessageValid = this.message != "";
    }
  }

  optionChanged(): void{
    this.isMessageValid = this.message != "";
  }

  goHome(): void{
    this.router.navigateByUrl('/home');
  }

}
