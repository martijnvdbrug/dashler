import {AfterViewInit, Component, Input} from '@angular/core';
import Chart from 'chart.js';
import {uuid} from '../../../lib/uuid';
import {Block} from '../../../lib/shared/graphql-types';
import {DashboardService} from '../../providers/dashboard.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements AfterViewInit {

  @Input()
  block: Block;
  @Input()
  dashboardId: string;

  chartId;
  chart: Chart;

  constructor(private dashboardService: DashboardService) {
    this.chartId = uuid();
  }

  ngAfterViewInit() {
    const ctx = (document.getElementById(`chart-${this.chartId}`) as HTMLCanvasElement).getContext('2d');
    const data = this.block.uptime ? [0, 2478, 3000, 734, 784, 600] : [1, 0, 0, 0, 0, 0];
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['no data', '0-100ms', '100-500ms', '500-1s', '>1s', 'Error'],
        datasets: [
          {
            backgroundColor: [
              '#9c9a9e',
              '#20c997',
              '#1f8764',
              '#118AB2',
              '#073B4C',
              '#e83e8c'],
            data
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
    });
  }

  async removeBlock(): Promise<void> {
    await this.dashboardService.removeBlock(this.dashboardId, this.block.id);
  }

}
