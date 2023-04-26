<template>
  <div>
    <v-container class="">
      <v-row :justify="justifycontent.center">
        <v-col cols="5" v-for="plan in plans" :key="plan">
          <v-card class="mx-auto" max-width="344">
            <v-img src="../assets/thumbnail dummy.jpg" height="200px"></v-img>

            <v-card-title>タイトルダミー</v-card-title>

            <v-card-subtitle
              >説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー</v-card-subtitle
            >

            <v-btn block>投票する</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="note">
      <p>Cardのサムネイルに使用している画像の引用先</p>
      著作者：<a
        target="_blank"
        href="https://jp.freepik.com/free-vector/flat-neon-gaming-youtube-thumbnail_33809384.htm#query=%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB&position=49&from_view=keyword&track=sph"
        >Freepik</a
      >
    </div>
  </div>
</template>

<style lang="scss">
.note {
  text-align: center;
}
</style>

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

  plans: object = [
    { description: "Aの説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。", title: "A" },
    { description: "Bの説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。", title: "B" },
    { description: "Cの説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。", title: "C" },
    { description: "Dの説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。説明です。", title: "D" },
  ];

  justifycontent: object = {
    center: "center",
  };

  async getdata() {
    const querySnapshot = await getDocs(collection(db, "plans"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}
</script>
