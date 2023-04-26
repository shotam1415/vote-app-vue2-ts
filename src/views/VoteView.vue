<template>
  <div class="vote">
    <h1 class="head">投票画面</h1>
    <div class="cardLayout">
      <div class="card">
        <img
          alt="Vue logo"
          src="../assets/thumbnail dummy.jpg"
          class="card__thumbnail"
        />
        <div class="card__text">
          <h2>タイトルダミー</h2>
          <div>
            説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー
          </div>
        </div>
        <button type="button" class="card__btn">投票する</button>
      </div>
      <div class="card">
        <img
          alt="Vue logo"
          src="../assets/thumbnail dummy.jpg"
          class="card__thumbnail"
        />
        <div class="card__text">
          <h2>タイトルダミー</h2>
          <div>
            説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー説明ダミー
          </div>
        </div>
        <button type="button" class="card__btn">投票する</button>
      </div>
    </div>
    <p>Cardのサムネイルに使用している画像の引用先</p>
    著作者：<a
      target="_blank"
      href="https://jp.freepik.com/free-vector/flat-neon-gaming-youtube-thumbnail_33809384.htm#query=%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB&position=49&from_view=keyword&track=sph"
      >Freepik</a
    >
  </div>
</template>

<style lang="scss">
img {
  width: 100%;
}

.head {
  text-align: center;
}

.cardLayout {
  margin: 0 auto;
  max-width: 1000px;
  display: grid;
  justify-content: space-between;
  grid-template-columns: 48% 48%;
  @media (768px >= width) {
    display: block;
  }
}

.card {
  box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.4);
  border-radius: 8px;
  padding-bottom: 24px;
  @media (768px >= width) {
    margin-bottom: 24px;
  }
}

.card__thumbnail {
  border-radius: 8px 8px 0px 0px;
}

.card__text {
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;
  color: #212a3e;
}

.card__btn {
  display: block;
  max-width: 300px;
  margin: 0 auto;
  text-decoration: none;
  border: solid 1px #394867;
  color: #394867;
  padding: 4px 8px;
  border-radius: 8px;
  text-align: center;
  transition-duration: 0.3s;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  background-color: #fff;
  &:hover {
    border: solid 1px #212a3e;
    background-color: #212a3e;
    color: #fff;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

@Component({})
export default class VoteViewComponent extends Vue {
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
