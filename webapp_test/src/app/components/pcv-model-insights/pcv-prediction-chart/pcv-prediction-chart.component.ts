import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IBatch } from '../../../../types/pcv-model-insights';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
declare const Plotly: any;

@Component({
  selector: 'app-pcv-prediction-chart',
  templateUrl: './pcv-prediction-chart.component.html',
  styleUrl: './pcv-prediction-chart.component.scss'
})
export class PcvPredictionChartComponent implements AfterViewInit, OnChanges {

  @ViewChild("plot", { static: false }) plotElement!: ElementRef;

  @Input({ required: true }) selectedBatchIds!: string[];

  @Input({ required: true }) batches!: IBatch[];

  @Output() toggleBatchId = new EventEmitter<string>();

  private defaultColorList: string[] = [
    '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
  ];

  private _plot: any;

  private _afterViewInit: boolean = false;

  public loading = true;

  private _data = () => [
    {
      x: this.getMetrics('predicted_pcv_10h'),
      y: this.getMetrics('measured_pcv'),
      type: 'scatter',
      mode: 'markers',
      marker:{ 
        size: 10,
        color: 'black'
      },
      showlegend: false,
      data: {
        unselected: true
      }
    },
    {
      x: this.getMetrics('predicted_pcv_60h'),
      y: this.getMetrics('measured_pcv'),
      xaxis: 'x2',
      yaxis: 'y2',
      type: 'scatter',
      mode: 'markers',
      marker:{ 
        size: 10,
        color: 'black'
      },
      showlegend: false,
      data: {
        unselected: true
      }
    },
    ...this.getSelectedTraces()
  ];

  private _config = {
    responsive: true,
    displayModeBar: false
  }

  private _layout = () => {
    return {
      title: {
        text: `<b>${this.translate.instant('pcv-model-insights.chart_title')}</b>`, 
        font: { 
          size: 18
        }, 
        xref: 'container', 
        x: 0
      },
      yaxis: { 
        title: this.translate.instant('pcv-model-insights.chart_measured_pcv'),
        showline: true,
        dtick: 0.05,
        showgrid : true,
        griddash:"dash",
        gridcolor: "#ccc",
      },
      yaxis2: { 
        title: this.translate.instant('pcv-model-insights.chart_measured_pcv'),
        showline: true,
        dtick: 0.05,
        showgrid : true,
        griddash:"dash",
        gridcolor: "#ccc",
      },
      xaxis: {
        title: this.translate.instant('pcv-model-insights.chart_predicted_pcv_10h'),
        showline: true,
        showgrid : false,
        zeroline: false
      },
      xaxis2: {
        title: this.translate.instant('pcv-model-insights.chart_predicted_pcv_60h'),
        showline: true,
        showgrid : false,
        zeroline: false
      },
      grid: {
        rows: 1,
        columns: 2,
        subplots:[['xy','x2y2']]
      },
      legend: {
        orientation: 'h'
        // xanchor: 'center',
      },
      hovermode: 'closest'
    }
  };

  constructor(private translate: TranslateService) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._afterViewInit === true && 
        changes['batches']?.currentValue?.length > 0 && 
        changes['batches']?.currentValue !== changes['batches']?.previousValue) {
        this.initPlot();
    }
    if (this._afterViewInit === true && changes['selectedBatchIds']?.currentValue && _.isEqual(changes['selectedBatchIds']?.currentValue, changes['selectedBatchIds']?.previousValue) === false) {
      this.initPlot();
    }
  }

  ngAfterViewInit(): void {
    this._afterViewInit = true;
    setTimeout(() => {
      this.initPlot();
    });
  }

  private getMetrics(col: keyof IBatch, outlier: boolean = false): (string | number | boolean)[] {
    return this.batches
      ?.filter((batch: IBatch) => !this.selectedBatchIds.includes(batch.batch_id))
      ?.filter((batch: IBatch) => batch.outlier_flag === outlier)
      .map((batch: IBatch) => batch[col]) ?? [];
  }

  private getSelectedTraces(): any[] {
    return this.batches?.filter((batch: IBatch) => this.selectedBatchIds.includes(batch.batch_id))
      .reduce((acc: any[], batch: IBatch, index: number) => {
        const traces: any[] = [{
            x: [batch.predicted_pcv_10h],
            y: [batch.measured_pcv],
            type: 'scatter',
            mode: 'markers',
            marker:{ 
              size: 16,
              color: this.getColorByIndex(index)
            },
            name: batch.batch_id,
            legendgroup: batch.batch_id,
            data: {
              batch_id: batch.batch_id
            }
          
        },
        {
            x: [batch.predicted_pcv_60h],
            y: [batch.measured_pcv],
            xaxis: 'x2',
            yaxis: 'y2',
            type: 'scatter',
            mode: 'markers',
            marker:{ 
              size: 16,
              color: this.getColorByIndex(index)
            },
            legendgroup: batch.batch_id,
            showlegend: false,
            data: {
              batch_id: batch.batch_id
            }
        }]
        return [...acc, ...traces];
      }, []) ?? [];
  }

  private initPlot(): void {
    if (this.batches?.length > 0) {
      this.loading = false;
    }
    Plotly.newPlot(this.plotElement!.nativeElement, this._data(), this._layout(), this._config);
    this.plotElement.nativeElement.on('plotly_click', (data: any) => this.updateByClick(data));
  }

  private updateByClick(data: any): void {
    const tracebinding: any = data.points[0].data.data;
    if (tracebinding.hasOwnProperty('batch_id')) {
      this.toggleBatchId.emit(tracebinding.batch_id);
    }
    if (tracebinding.unselected === true) {
      const idx: number = data.points[0].pointIndex;
      const batchId: string = this.getMetrics('batch_id')[idx] as string;
      if (this.getBatchByBatchId(batchId).outlier_flag === false) {
        this.toggleBatchId.emit(this.getMetrics('batch_id')[idx] as string);
      }
    }
  }

  private getColorByIndex(index: number): string {
    // return 'Plotly.d3.scale.category10()(index)';
    return this.defaultColorList[index];
  }

  private getBatchByBatchId(batchId: string): IBatch {
    return this.batches.find((batch: IBatch) => batch.batch_id === batchId) as IBatch;
  }
}
