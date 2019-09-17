import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import Chart from 'chart.js'

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements AfterViewInit {

  chartId;

  constructor() {
    this.chartId = String(Math.floor(Math.random()* 100000000));
  }

  ngAfterViewInit() {
    console.log('aftervieww', this.chartId);
    const ctx = (document.getElementById(`chart-${this.chartId}`)as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        // labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [2478,5267,734,784,433]
          }
        ]
      },
      options: {
      }
    });
  }

}
