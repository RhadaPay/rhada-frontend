import Vue from "vue";
import {
  Bar,
  HorizontalBar,
  Line,
  mixins as chartMixins,
  Scatter,
} from "vue-chartjs";
import Component, { mixins } from "vue-class-component";
import { ChartData, ChartOptions } from "chart.js";

const Props = Vue.extend({
  props: {
    chartData: {
      type: Object as () => ChartData,
      default: undefined,
    },
    options: {
      type: Object as () => ChartOptions,
      default: undefined,
    },
  },
});

@Component({ extends: Line, mixins: [chartMixins.reactiveProp] })
export class LineChart extends mixins(Props, Line) {
  mounted(): void {
    this.renderChart(this.chartData, this.options);
  }
}

@Component({ extends: HorizontalBar, mixins: [chartMixins.reactiveProp] })
export class BarChart extends mixins(Props, HorizontalBar) {
  mounted(): void {
    this.renderChart(this.chartData, this.options);
  }
}

@Component({ extends: Scatter, mixins: [chartMixins.reactiveProp] })
export class ScatterChart extends mixins(Props, Scatter) {
  mounted(): void {
    this.renderChart(this.chartData, this.options);
  }
}
