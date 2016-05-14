﻿import {Component, Input, SimpleChange, OnChanges} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {ClusterCapacityHistoryViewModel} from './../viewmodels/clustercapacityhistoryviewmodel';
import {DataService} from './../services/data.service';

declare var Chart: any;

@Component({
    selector: 'cluster-capacity-graph',
    templateUrl: 'app/components/clustercapacitygraph.component.html',
    styleUrls: ['app/components/clustercapacitygraph.component.css'],
    directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ClusterCapacityGraph implements OnChanges {

    @Input()
    private capacityHistory: ClusterCapacityHistoryViewModel[];
    
    private chartData: Array<Array<number>> = [];
    private chartLabels: Array<string> = [];
    private chartSeries: Array<string> = [];
    
    private chartOptions: any = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        fontFamily: "'Segoe UI', 'Segoe', Arial, sans-serif",
        scaleFontFamily: "'Segoe UI', 'Segoe', Arial, sans-serif",
        scaleFontSize: 11,
        showTooltips: true,
        pointLabelFontFamily: "'Segoe UI', 'Segoe', Arial, sans-serif",
        tooltipCornerRadius: 0,
        tooltipFontFamily: "'Segoe UI', 'Segoe', Arial, sans-serif",
        tooltipFontSize: 12,
        tooltipXPadding: 10,
        tooltipYPadding: 10,
        pointDotRadius: 2,
        bezierCurveTension: 0.2,
        datasetStrokeWidth: 1,
        scaleGridLineColor: "#333333",
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };

    private chartColours: Array<any> = [
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#CCC',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            fillColor: 'rgba(77,83,96,0.2)',
            strokeColor: 'rgba(77,83,96,1)',
            pointColor: 'rgba(77,83,96,1)',
            pointStrokeColor: '#CCC',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(77,83,96,1)'
        }
    ];

    private chartLegend: boolean = true;
    private chartType: string = 'Line';

    public constructor(private dataService: DataService)
    {
    }

    public ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

        if (this.capacityHistory && this.capacityHistory.length > 0) {

            this.chartData = this.capacityHistory.filter(x => x.selected).map(x => x.history.map(y => y.capacity.load));
            this.chartSeries = this.capacityHistory.filter(x => x.selected).map(x =>  x.name);
            this.chartLabels = this.capacityHistory[0].history.map(x => x.timestamp.toLocaleTimeString());
        }
    }

    // events
    chartClicked(e: any) {
        //console.log(e);
    }

    chartHovered(e: any) {
       // console.log(e);
    }

}