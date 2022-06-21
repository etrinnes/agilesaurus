import { Injectable } from "@angular/core";
import { VoteModel, VoteOption, VoteType } from "./session";

@Injectable()
export class VoteTypeService {
  firebaseConfig = {
    apiKey: "AIzaSyBnLp-ETayV5uGL6xxQAYhAI6RZD-_CL8Y",
    authDomain: "agilesaurus-12821.firebaseapp.com",
    databaseURL: "https://agilesaurus-12821-default-rtdb.firebaseio.com",
    projectId: "agilesaurus-12821",
    storageBucket: "agilesaurus-12821.appspot.com",
    messagingSenderId: "1004375862252",
    appId: "1:1004375862252:web:6d2d20f7fe06ecac72aec9",
    measurementId: "G-6NX6VXVGP8"
  };

  constructor() { }

  getVoteOptions(votingType: VoteType): VoteOption[]{

    let voteOptions : VoteOption[] = [
        {id: "1", imagePath: "", title: "", description: ""},
        {id: "2", imagePath: "", title: "", description: ""},
        {id: "3", imagePath: "", title: "", description: ""},
        {id: "5", imagePath: "", title: "", description: ""},
        {id: "8", imagePath: "", title: "", description: ""},
        {id: "13", imagePath: "", title: "", description: ""},
    ];

    switch(votingType)
    {
        case VoteType.Dinos:
            voteOptions = [
                {id: "microraptor", imagePath: "../../assets/images/alvarezsaurus.svg", title: "Microraptor", description: "A very tiny dino!", style:"width: 14em;"},
                {id: "velociraptor", imagePath: "../../assets/images/velociraptor.svg", title: "Velociraptor", description: "Pretty small", style:"width: 14em;"},
                {id: "triceratops", imagePath: "../../assets/images/triceratops.svg", title: "Triceratops", description: "Medium", style:"width: 18em;"},
                {id: "trex", imagePath: "../../assets/images/tyrannosaurus.svg", title: "T. Rex", description: "Large", style:"width: 18em;"},
                {id: "brachiosaurus", imagePath: "../../assets/images/brachiosaurus.svg", title: "Brachiosaurus", description: "Giant!", style:"width: 20em;"},
                {id: "meteor", imagePath: "../../assets/images/meteor.svg", title: "Meteor!", description: "Bad things are gonna happen with this one...", style:"width: 20em;"}
            ];
            break;
        default:
            voteOptions = [
                {id: "1", imagePath: "", title: "", description: ""},
                {id: "2", imagePath: "", title: "", description: ""},
                {id: "3", imagePath: "", title: "", description: ""},
                {id: "5", imagePath: "", title: "", description: ""},
                {id: "8", imagePath: "", title: "", description: ""},
                {id: "13", imagePath: "", title: "", description: ""},
            ];
            break;
    }
    // if(votingType == VoteType.Fib) {
    //     voteOptions = [1, 2, 3, 5, 8, 13];
    // }
    // else if(votingType == VoteType.Dinos){
    // voteOptions = ["microraptor", "velociraptor", "triceratops", "t. rex", "brachiosaurus", "meteor"];
    // }
    return voteOptions;
  }

  getVoteModel(sessionType: string) : VoteModel[] {
    //let votes = [{point: '1', votes: 0}, {point: '2', votes: 0}, {point: '3', votes: 0}, {point: '5', votes: 0}, {point: '8', votes: 0}, {point: '13', votes: 0}];
    let votes : VoteModel[] = [];
    let voteOptions = this.getPointTypeList(sessionType);
    voteOptions.forEach(voteOption => {
        votes.push({point: voteOption, votes: 0});
    });
    return votes;
  }

  getImagePath(name: string) : string {
    switch(name){
        case "microraptor":
            return "../../assets/images/alvarezsaurus.svg";
        case "velociraptor":
            return "../../assets/images/velociraptor.svg";
        case "triceratops":
            return "../../assets/images/triceratops.svg";
        case "trex":
            return "../../assets/images/tyrannosaurus.svg";
        case "brachiosaurus":
            return "../../assets/images/brachiosaurus.svg";
        case "meteor":
            return "../../assets/images/meteor.svg";
        default:
            return "../../assets/images/meteor.svg";
    }
  }

  private getPointTypeList(sessionType: string): string[]{
    switch(sessionType){
        case VoteType.Dinos:
            return ["microraptor", "velociraptor", "triceratops", "trex", "brachiosaurus", "meteor"];
            break;
        default:
            return ["1", "2", "3", "5", "8", "13"];
            break;
    }
  }

  private getPossibleFibPoints(): string[]{
    return ["1", "2", "3", "5", "8", "13"];
  }

  private getPossibleDinos(): string[]{
    return ["microraptor", "velociraptor", "triceratops", "trex", "brachiosaurus", "meteor"];
  }

}