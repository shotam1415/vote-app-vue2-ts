<template>
  <v-container>
    <v-btn block>
      {{ msg }}
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class HelloWorld extends Vue {
  @Prop({ type: String, required: true })
  msg: string | undefined;

  @Getter currentCount!: string;
  mounted() {
    console.log(this.currentCount);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
