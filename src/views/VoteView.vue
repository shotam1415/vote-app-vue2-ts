<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-img src="../assets/thumbnail dummy.jpg" height="200px"></v-img>

      <v-card-title>タイトルダミー</v-card-title>

      <v-card-subtitle
        >説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー</v-card-subtitle
      >

      <v-btn block>投票する</v-btn>
    </v-card>
    <p>Cardのサムネイルに使用している画像の引用先</p>
    著作者：<a
      target="_blank"
      href="https://jp.freepik.com/free-vector/flat-neon-gaming-youtube-thumbnail_33809384.htm#query=%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB&position=49&from_view=keyword&track=sph"
      >Freepik</a
    >
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

@Component({})
export default class VoteViewComponent extends Vue {
  show: boolean = false;
  mounted() {
    console.log(this.getdata());
  }

  async getdata() {
    const querySnapshot = await getDocs(collection(db, "plans"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}
</script>
