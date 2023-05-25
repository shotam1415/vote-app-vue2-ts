<template>
  <v-dialog v-model="isNewItemDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">New Item</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="title" required v-model="dialogNewItemData.title"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="description" required v-model="dialogNewItemData.description"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-alert v-show="newItemWarningMessage" type="warning" class="mx-8">{{ newItemWarningMessage }}</v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeNewItem"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveNewItem"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { collection, addDoc } from "firebase/firestore";
import db from "../../../firebase/firestore";
import { Getter, Mutation } from "vuex-class";
import { Content } from "../../../../src/types/Content";

@Component
export default class AdminContentsNewItem extends Vue {
  dialogNewItemData = {
    title: "",
    description: "",
  };
  newItemWarningMessage = "";
  isNewItemDialog = false;

  @Getter currentContents!: Content[];
  @Mutation("setCurrentContents") setCurrentContents!: (content: Content[]) => void;

  @Emit("childEmitSetContents")
  setContents() {
    console.log("setContents");
  }

  //保存
  async saveNewItem() {
    //入力欄を判定
    if (this.hasEmptyProperty(this.dialogNewItemData)) {
      this.newItemWarningMessage = "情報を入力してください";
      return false;
    }
    try {
      await addDoc(collection(db, "contents"), this.dialogNewItemData);
      //挿入後ストアを更新
      this.setContents();
      //入力情報クリア
      this.clearNewItem();
    } catch (error) {
      console.log(error);
      //入力情報クリア
      this.clearNewItem();
    }
    this.isNewItemDialog = false;
  }

  hasEmptyProperty(object: any) {
    for (let prop in object) {
      if (object.hasOwnProperty(prop) && object[prop] === "") {
        return true;
      }
    }
    return false;
  }

  openNewItemDialog(): void {
    this.isNewItemDialog = true;
  }

  clearNewItem() {
    this.newItemWarningMessage = "";
    this.dialogNewItemData.title = "";
    this.dialogNewItemData.description = "";
  }

  closeNewItem() {
    this.clearNewItem();
    this.isNewItemDialog = false;
  }
}
</script>
