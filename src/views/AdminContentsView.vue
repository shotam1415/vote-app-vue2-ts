<template>
  <div>
    <template>
      <div>
        <v-data-table :headers="headers" :items="contents" item-key="id" class="elevation-1" :search="search">
          <template v-slot:top>
            <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:body.append>
            <v-btn color="primary" dark class="mb-2 ml-4 mt-4" @click="NewItem()"> New Item </v-btn>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </div>
    </template>
    <template>
      <v-row justify="center">
        <v-dialog v-model="isEditItemDialog" persistent max-width="600px">
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="isEditItemDialog = false"> Close </v-btn>
                <v-btn color="blue darken-1" text @click="saveEditItem"> Save </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isNewItemDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">New Profile</span>
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
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="isNewItemDialog = false"> Close </v-btn>
              <v-btn color="blue darken-1" text @click="saveNewItem"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import db from "../firebase/firestore";

@Component
export default class AdminContentsView extends Vue {
  get headers(): any {
    return [
      {
        text: "タイトル",
        value: "title",
      },
      { text: "説明", value: "description" },
      { text: "操作", value: "actions" },
    ];
  }

  contents = [];
  search = "";
  calories = "";
  isNewItemDialog = false;
  isEditItemDialog = false;

  dialogCurrentData = {
    id: "",
    title: "",
    description: "",
  };

  dialogNewItemData = {
    title: "",
    description: "",
  };

  dialogEditItemData = {
    title: "",
    description: "",
  };

  NewItem() {
    this.isNewItemDialog = true;
  }

  async saveNewItem() {
    await addDoc(collection(db, "contents"), this.dialogNewItemData);
    this.setContents();
    this.isNewItemDialog = false;
  }

  editItem(item: any) {
    console.log(item);
    //データクリア
    this.dialogEditItemData.title = "";
    this.dialogEditItemData.description = "";

    this.dialogCurrentData.id = item.id;
    this.dialogCurrentData.title = item.title;
    this.dialogCurrentData.description = item.description;

    this.isEditItemDialog = true;
  }

  async saveEditItem() {
    const docRef = doc(db, "contents", this.dialogCurrentData.id);
    const title = this.dialogEditItemData.title ? this.dialogEditItemData.title : this.dialogCurrentData.title;
    const description = this.dialogEditItemData.description ? this.dialogEditItemData.description : this.dialogCurrentData.description;

    const updatedItem = {
      title: title,
      description: description,
    };

    try {
      await updateDoc(docRef, updatedItem);
      this.setContents();
    } catch (error) {
      console.log(error);
    }
    this.isEditItemDialog = false;
  }

  async deleteItem(content_id: string) {
    const result = confirm("消しますか");
    if (result) {
      await deleteDoc(doc(db, "contents", content_id));
      this.setContents();
    }
  }

  async setContents() {
    const contentRef = collection(db, "contents");
    const contentQuerySnapshot = await getDocs(contentRef);
    const contents = contentQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      const content: any = {
        id: doc.id,
        title: data.title,
        description: data.description,
      };
      return content;
    });
    this.$store.commit("setContents", contents);
    this.contents = this.getContents;
  }

  get getContents(): any {
    return this.$store.getters.contents;
  }

  async mounted() {
    this.setContents();
  }
}
</script>
