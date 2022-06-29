import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { VoteModel, VoteType } from '../session';
import { VoteTypeService } from '../vote-type.service';

@Component({
  selector: 'results-chart',
  templateUrl: './results-chart.component.html',
  styleUrls: ['./results-chart.component.scss']
})
export class ResultsChartComponent implements OnInit {

  @Input() votes : VoteModel[];
  @Input() votingType : VoteType;
  colors: string[] = [];
  title = "Results";
  chartType = ChartType.ColumnChart;
  voteData : any = [];
  columnNames : string[] = [];
  chartOptions = {};
  width = 550;
  height = 400;

  constructor(private voteTypeService: VoteTypeService) { }

  ngOnInit(): void {
    this.initializeData();
    this.width = 1200;
    this.height = 700;
  }

  ngAfterViewInit(): void{
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(() => this.drawChart(this.voteData, this.colors, this.votingType));
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

  drawChart(voteData: any, chartColors: string[], votingType : VoteType): void {
    let data = google.visualization.arrayToDataTable(voteData);
    var view = new google.visualization.DataView(data);
    let chartObject = document.getElementById("columnchart_values");
    if(chartObject){
      var chart = new google.visualization.ColumnChart(chartObject);
      let options : any = {
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        vAxis: {
          title: 'Votes',
          scaleType: 'linear',
          format: '0'
      }
      };
      chart.draw(view, options);

      if(votingType == VoteType.Dinos){
        // add lil dino icons
        var chartContainer = document.getElementById("columnchart_values");
        if(chartContainer){
          var svg = chartContainer.getElementsByTagName('svg')[0];
          var barLabels = svg.querySelectorAll("text[text-anchor='middle']");
  
          for (var i = 0; i < barLabels.length; i++) {
              var barArea : HTMLElement = barLabels[i] as HTMLElement;
              if(barArea){
                let x : string = barArea.getAttribute('x') as string;
                let y : string = barArea.getAttribute('y') as string;
  
                let imagePath = this.voteTypeService.getImagePath(barLabels[i].innerHTML);
                if(barLabels[i].innerHTML != "Votes"){
                  (barLabels[i] as HTMLElement).style.paddingBottom = "20px";
                  let icon = createImage({ source: imagePath, x: x, y: y, width: 50, height: 50 });
                  barArea.parentElement?.appendChild(icon);
                }
              }
          }
        }
      }
    }

    function createImage(options: any) {
      var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttributeNS(null, 'height', options.height);
      image.setAttributeNS(null, 'width', options.width);
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.source);

      let adjustedX = parseInt(options.x) - 20;
      let adjustedY = parseInt(options.y) + 10;
      image.setAttributeNS(null, 'x', adjustedX.toString());
      image.setAttributeNS(null, 'y', adjustedY.toString());
      image.setAttributeNS(null, 'visibility', 'visible');
      return image;
  }
}

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.drawChart(this.voteData, this.colors, this.votingType);
}

}
