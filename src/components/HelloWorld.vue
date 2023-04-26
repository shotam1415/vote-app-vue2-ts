<template>
  <div class="hello">
    <p>hello</p>
    <p>{{ msg }}</p>
    <p>{{ name2 }}</p>
    <button type="button" @click="changeMsg">チェンジ</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  name2: string = "taro";

  @Prop({ type: String, required: true })
  msg: string | undefined;

  @Emit("changeMsg")
  changeMsg(): void {
    this.name2 = "jiro";
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
