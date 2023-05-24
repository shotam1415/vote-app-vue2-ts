<template>
  <div>
    <template>
      <div>
        <v-data-table :headers="headers" :items="contents" item-key="id" class="elevation-1">
          <template v-slot:top>
            <v-row class="" justify="center">
              <v-col cols="3">
                <v-text-field v-model="titleFilterValue" type="text" label="Search (Title)"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="descriptionFilterValue" type="text" label="Search (Discription)"> </v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`body.append`]>
            <v-btn color="primary" dark class="mb-2 ml-4 mt-4" @click="openNewItemDialog()"> New Item </v-btn>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="openEditItemDialog(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </div>
    </template>
    <template>
      <v-row justify="center">
        <v-dialog v-model="isEditItemDialog" persistent max-width="600px" data-type="EditProfile">
          <v-card>
            <v-form>
              <v-card-title>
                <span class="text-h5">Edit Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="title(old)" readonly filled v-bind:value="dialogCurrentData.title"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="title(new)" required v-model="dialogEditItemData.title"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="description(old)" readonly filled v-bind:value="dialogCurrentData.description"></v-text-field>
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
            </v-form>
          </v-card>
        </v-dialog>
        <AdminContentsNewItem ref="childComponent" @childEmitSetContents="setContents" @childEmithasEmptyProperty="hasEmptyProperty" />
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import { Getter, Mutation } from "vuex-class";
import AdminContentsNewItem from "../admin/modal/AdminContentsNewItem.vue";

type Content = {
  id: string;
  title: string;
  description: string;
};

@Component({
  components: {
    AdminContentsNewItem,
  },
})
export default class AdminContents extends Vue {
  // v-data-table用変数
  get headers() {
    return [
      {
        text: "タイトル",
        value: "title",
        filter: this.titleFilter,
      },
      { text: "説明", value: "description", filter: this.descriptionFilter },
      { text: "操作", value: "actions" },
    ];
  }
  contents: Content[] | undefined = [];
  titleFilterValue = "";
  descriptionFilterValue = "";
  titleFilter(value: string) {
    if (!this.titleFilterValue) {
      return true;
    }
    return value.toLowerCase().includes(this.titleFilterValue.toLowerCase());
  }
  descriptionFilter(value: string) {
    if (!this.descriptionFilterValue) {
      return true;
    }
    return value.toLowerCase().includes(this.descriptionFilterValue.toLowerCase());
  }
  // モーダルのフラグ
  isEditItemDialog = false;

  // 入力データの格納先
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
  @Ref() childComponent!: AdminContentsNewItem;

  openNewItemDialog() {
    this.childComponent.openNewItemDialog();
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
    this.clearEditDialogItem;
    this.addDialogCurrentValue(item);
  }

  clearEditDialogItem() {
    this.editItemWarningMessage = "";
    this.dialogEditItemData.title = "";
    this.dialogEditItemData.description = "";
  }

  addDialogCurrentValue(item: Content) {
    this.dialogCurrentData.id = item.id;
    this.dialogCurrentData.title = item.title;
    this.dialogCurrentData.description = item.description;
  }

  prioritizeUpdatedData() {
    const title = this.dialogEditItemData.title ? this.dialogEditItemData.title : this.dialogCurrentData.title;
    const description = this.dialogEditItemData.description ? this.dialogEditItemData.description : this.dialogCurrentData.description;
    const updatedItem = {
      title: title,
      description: description,
    };
    return updatedItem;
  }

  closeEditItem() {
    this.clearEditDialogItem();
    this.isEditItemDialog = false;
  }

  async saveEditItem() {
    if (this.hasEmptyProperty(this.dialogEditItemData)) {
      this.editItemWarningMessage = "情報を入力してください";
      return false;
    }
    const docRef = doc(db, "contents", this.dialogCurrentData.id);
    const updatedData = this.prioritizeUpdatedData();
    try {
      await updateDoc(docRef, updatedData);
      this.setContents();
      this.clearEditDialogItem();
    } catch (error) {
      console.log(error);
    }
    this.isEditItemDialog = false;
  }

  async deleteItem(content_id: string) {
    const result = confirm("本当に消去しますか。");
    if (result) {
      await deleteDoc(doc(db, "contents", content_id));
      this.setContents();
    }
  }

  async setContents() {
    const contentRef = collection(db, "contents");
    const contentQuerySnapshot = await getDocs(contentRef);
    const contents = contentQuerySnapshot.docs.map((doc) => {
      console.log(doc);
      const data = doc.data();
      const content: Content = {
        id: doc.id,
        title: data.title,
        description: data.description,
      };
      return content;
    });
    this.setCurrentContents(contents);
    this.contents = this.currentContents;
  }

  @Getter currentContents!: Content[];
  @Mutation("setCurrentContents") setCurrentContents!: (content: Content[]) => void;

  async mounted() {
    this.setContents();
  }
}
</script>
