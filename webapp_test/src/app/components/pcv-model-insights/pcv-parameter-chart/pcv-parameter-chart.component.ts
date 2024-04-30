import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IBatch, IParameterDataRow } from '../../../../types/pcv-model-insights';
import { Observable, tap } from 'rxjs';
import * as _ from 'lodash';
declare const Plotly: any;

@Component({
  selector: 'app-pcv-parameter-chart',
  templateUrl: './pcv-parameter-chart.component.html',
  styleUrl: './pcv-parameter-chart.component.scss'
})
export class PcvParameterChartComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild("plot", { static: false }) plotElement!: ElementRef;

  @Input({ required: true }) selectedBatches!: IBatch[];

  @Input({ required: true}) parameter!: string;

  @Input({ required: true}) parameterData!: Observable<IParameterDataRow[] | null>;

  private _data!: IParameterDataRow[] | null;

  private _afterViewInit: boolean = false;

  public loading = true;

  get data(): IParameterDataRow[] {
    if (this._data) {
      return this._data;
    }
    return [];
  }

  get x(): number[] {
    if (this._data) {
      return this._data.map((row: IParameterDataRow) => row.x);
    }
    return [];
  }

  get y(): number[] {
    if (this._data) {
      return this._data.map((row: IParameterDataRow) => row.y);
    }
    return [];
  }

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

  private _layout = () => {
    return {
      title: {
        text: '<b>' + this.parameter + '</b>', 
        font: { 
          size:18
        }, 
        xref: 'container', 
        x: 0
      },
      xaxis: {
        title: { 
            text : this.parameter
        },
        showline: true,
        showgrid : false,
        range: [_.min(this.x) || 0, _.max(this.x) || 0],
      },
      yaxis: {
        title: { 
            text : 'Density',
            standoff:25
        },
        showline: true,
        dtick: 200,
        showgrid: true,
        griddash: 'dash',
        gridcolor: '#ccc',
        range: [_.min(this.y) || 0, _.max(this.y) || 0],
      },
      hovermode: 'x',
      hoverdistance: 1
    };
  }

  private _traces = () => [
    {
      x: this.x,
      y: this.y,
      type: 'scatter',
      mode: 'lines',
      showlegend: false,
      line: {
        color: 'black',
        width: 1,
        shape:"spline",
     //   smoothing: 1.3
      },
      hoverinfo:"skip",
    },
    ...this.getBatchTraces()
  ];

  private _config = {
    responsive: true,
    displayModeBar: false
  }

  ngOnInit(): void {
    this.parameterData.pipe(
      tap((data: IParameterDataRow[] | null) => {
        this._data = data;
        this.loading = false;
        if (this._afterViewInit && data && data.length > 0) {
          this.initPlot();
        }
      })
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._afterViewInit === true && _.isEqual(changes['selectedBatches'].currentValue, changes['selectedBatches'].previousValue) === false) {
      this.initPlot();
    }
  }

  ngAfterViewInit(): void {
    this._afterViewInit = true;
    setTimeout(() => {
      this.initPlot();
    });
  }

  private getBatchTraces(): any[] {
    if (!!this.selectedBatches) {
      return this.selectedBatches.map((batch: IBatch, index: number) => {
        const x: number = (batch as IBatch)[this.parameter];
        return {
          x: [x, x],
          y: [_.min(this.y) || 0, _.max(this.y) || 0],
          type: 'scatter',
          mode: 'lines',
          name: batch.batch_id,
          showlegend: true,
          line: {
            color: this.defaultColorList[index],
            width: 1,
          },
          hovertemplate: `Batch: ${batch.batch_id}<br />Parameter value: %{x}<extra></extra>`,
        };
      });
    }
    return [];
  }

  private initPlot(): void {
    Plotly.newPlot(this.plotElement!.nativeElement, this._traces(), this._layout(), this._config);
  }
}
