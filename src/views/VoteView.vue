<template>
  <div>
    <v-container class="">
      <v-row :justify="justifycontent.center">
        <v-col cols="5" v-for="plan in plans" :key="plan.title">
          <v-card class="mx-auto" max-width="344">
            <v-img src="../assets/thumbnail dummy.jpg" height="200px"></v-img>

            <v-card-title>{{ plan.title }}</v-card-title>

            <v-card-subtitle>{{ plan.description }}</v-card-subtitle>

            <v-btn block @click="postVote(plan.id)">投票する</v-btn>
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
import { collection, getDocs, addDoc } from "firebase/firestore";
import db from "../firebase/firestore";
import { Plan } from "../types/Plan";

@Component({})
export default class VoteViewComponent extends Vue {
  mounted() {
    console.log(this.getPlans());
  }

  justifycontent = {
    center: "center",
  };

  plans: Plan[] = new Array();
  async getPlans() {
    const citiesRef = collection(db, "plans");
    const querySnapshot = await getDocs(citiesRef);
    this.plans = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const plan: Plan = {
        id: doc.id,
        title: data.title,
        description: data.description,
        created_at: data.created_at,
        update_at: data.update_at,
      };
      return plan;
    });
  }

  async postVote(plan_id: string) {
    const docRef = await addDoc(collection(db, "votes"), {
      plan_id: plan_id,
      user_id: "b7b9f406-84dd-68e3-8f98-f119ba48d543", //To do userId入れる
      created_at: new Date(),
      update_at: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  }
}
</script>
