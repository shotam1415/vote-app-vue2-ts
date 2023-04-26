<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["chartData", "options"],
  data() {
    return {
      // height: "800px",
      // width: "800px",
    };
  },
  mounted() {
    console.log(this.chartData);
    this.renderChart(this.chartData, this.options);
  },
};
</script>
