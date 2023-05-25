<template>
  <v-dialog v-model="isEditItemDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Item</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field label="title(old)" readonly filled v-model="dialogCurrentData.title"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="title(new)" required v-model="dialogEditItemData.title"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="description(old)" readonly filled v-model="dialogCurrentData.description"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="description(new)" required v-model="dialogEditItemData.description"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-alert v-show="editItemWarningMessage" type="warning" class="mx-8">{{ editItemWarningMessage }}</v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditItem"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveEditItem"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { doc, updateDoc } from "firebase/firestore";
import { Content } from "../../../../src/types/Content";
import db from "../../../firebase/firestore";

@Component
export default class EditItemComponent extends Vue {
  // モーダルのフラグ
  isEditItemDialog = false;

  dialogCurrentData = {
    id: "",
    title: "",
    description: "",
  };
  dialogEditItemData = {
    title: "",
    description: "",
  };
  editItemWarningMessage = "";

  @Emit("childEmitSetContents")
  setContents() {
    console.log("親コンポーネントのメソッド");
  }

  async saveEditItem() {
    //入力欄を判定
    if (this.hasEmptyProperty(this.dialogEditItemData)) {
      this.editItemWarningMessage = "情報を入力してください";
      return false;
    }
    const docRef = doc(db, "contents", this.dialogCurrentData.id);
    const updatedData = this.prioritizeUpdatedData();
    try {
      await updateDoc(docRef, updatedData);
      //挿入後ストアを更新
      this.setContents();
      //入力情報クリア
      this.clearEditDialogItem();
    } catch (error) {
      console.log(error);
      //入力情報クリア
      this.clearEditDialogItem();
    }
    this.isEditItemDialog = false;
  }

  hasEmptyProperty(object: any) {
    for (let prop in object) {
      if (object.hasOwnProperty(prop) && object[prop] === "") {
        return true;
      }
    }
    return false;
  }

  openEditItemDialog(item: Content) {
    this.isEditItemDialog = true;
    console.log(item);
    this.clearEditDialogItem();
    this.addDialogCurrentValue(item);
  }

  clearEditDialogItem() {
    this.editItemWarningMessage = "";
    this.dialogEditItemData.title = "";
    this.dialogEditItemData.description = "";
  }

  closeEditItem() {
    this.clearEditDialogItem();
    this.isEditItemDialog = false;
  }
  addDialogCurrentValue(item: Content) {
    this.dialogCurrentData.id = item.id;
    this.dialogCurrentData.title = item.title;
    this.dialogCurrentData.description = item.description;
  }

  prioritizeUpdatedData() {
    const title = this.dialogEditItemData.title || this.dialogCurrentData.title;
    const description = this.dialogEditItemData.description || this.dialogCurrentData.description;
    const updatedItem = {
      title: title,
      description: description,
    };
    return updatedItem;
  }
}
</script>
