import {AfterViewInit, Component} from '@angular/core';
import Chart from 'chart.js';
import {uuid} from '../../../lib/uuid';
import {DashboardService} from '../../dashboard.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements AfterViewInit {


  chartId;
  chart: Chart;

  constructor(
    private dashboardService: DashboardService
  ) {
    this.chartId = uuid();
  }

  ngAfterViewInit() {
    const ctx = (document.getElementById(`chart-${this.chartId}`) as HTMLCanvasElement).getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        // labels: ['Africa', 'Asia', 'Europe', 'Latin America', 'North America'],
        datasets: [
          {
            label: 'Population (millions)',
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
            data: [2478, 5267, 734, 784, 433]
          }
        ]
      },
      options: {}
    });
  }

}
