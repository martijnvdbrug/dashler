import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Output() editClicked = new EventEmitter<Block>();

  chartId;
  chart: Chart;

  constructor(private dashboardService: DashboardService) {
    this.chartId = uuid();
  }

  ngAfterViewInit() {
    const ctx = (document.getElementById(`chart-${this.chartId}`) as HTMLCanvasElement).getContext('2d');
    let data: [number, number, number, number, number, number];
    if (!this.block.uptime || !this.block.uptime.stats) {
      data = [1, 0, 0, 0, 0, 0];
    } else {
      const stats = this.block.uptime.stats;
      data = [0,
        stats.ms0_500,
        stats.ms500_1,
        stats.s1_2,
        stats.s2,
        stats.error
      ];
    }
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['no data', '0-500ms', '500ms-1s', '1s-2s', '>2s', 'Error'],
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
        },
        tooltips: {
          callbacks: {
            label: (item, d) => `${d.datasets[item.datasetIndex].data[item.index]}%`
          }
        },
      }
    });
  }

  async removeBlock(): Promise<void> {
    if (confirm(`Are you sure you want to delete this block?`)) {
      await this.dashboardService.removeBlock(this.dashboardId, this.block.id);
    }
  }

  async emitEdit(): Promise<void> {
    this.editClicked.emit(this.block);
  }

}
