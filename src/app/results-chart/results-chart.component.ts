import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { VoteModel } from '../session';

@Component({
  selector: 'results-chart',
  templateUrl: './results-chart.component.html',
  styleUrls: ['./results-chart.component.scss']
})
export class ResultsChartComponent implements OnInit {

  @Input() votes : VoteModel[];
  colors: string[] = [];
  title = "Results";
  chartType = ChartType.ColumnChart;
  voteData : any = [];
  columnNames : string[] = [];
  chartOptions = {};
  width = 550;
  height = 400;

  constructor() { }

  ngOnInit(): void {
    this.initializeData();

    this.width = 1200;
    this.height = 700;

  }

  ngAfterViewInit(): void{
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(() => this.drawChart(this.voteData, this.colors));
  }

  initializeData() : any{
    this.voteData.push([{label: "Point", type: 'string'}, {label: "Votes", type: 'number'}, {role: 'style'}]);
    this.votes.forEach(vote => {
      this.voteData.push([vote.point, vote.votes, vote.color]);
      if(vote && vote.color){
        this.colors.push(vote.color);
      }
    });
    this.chartOptions = {colors: this.colors, is3D: true };
    return this.voteData;
  }

  drawChart(voteData: any, chartColors: string[]): void {
    // let chartData : any[] = [];
    // this.votes.forEach(vote => {
    //   chartData.push([vote.point, vote.votes, vote.color]);
    // });

    let data = google.visualization.arrayToDataTable(voteData);
    var view = new google.visualization.DataView(data);
    // view.setColumns([0, 1,
    //                  { calc: "stringify",
    //                    sourceColumn: 1,
    //                    type: "string",
    //                    role: "annotation" },
    //                  2]);

   
    let thing = document.getElementById("columnchart_values");
    if(thing){
      var chart = new google.visualization.ColumnChart(thing);
      let options : any = {
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        vAxis: {
          title: 'Votes',
          scaleType: 'linear'
      }
      };
      chart.draw(view, options);
    }

}

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.drawChart(this.voteData, this.colors);
}



}
