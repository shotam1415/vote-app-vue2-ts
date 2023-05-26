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
                <v-text-field v-model="descriptionFilterValue" type="text" label="Search (Description)"> </v-text-field>
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
        <NewItemComponent ref="newItemComponent" @childEmitSetContents="setContents" />
        <EditItemComponent ref="editItemComponent" @childEmitSetContents="setContents" />
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import db from "../../firebase/firestore";
import { Getter, Mutation } from "vuex-class";
import NewItemComponent from "../admin/modal/NewItemComponent.vue";
import EditItemComponent from "../admin/modal/EditItemComponent.vue";
import { Content } from "@/types/Content";

@Component({
  components: {
    NewItemComponent,
    EditItemComponent,
  },
})
export default class AdminContents extends Vue {
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

  //タイトル検索
  titleFilter(value: string) {
    if (!this.titleFilterValue) {
      return true;
    }
    return value.toLowerCase().includes(this.titleFilterValue.toLowerCase());
  }
  //ディスクリプション検索
  descriptionFilter(value: string) {
    if (!this.descriptionFilterValue) {
      return true;
    }
    return value.toLowerCase().includes(this.descriptionFilterValue.toLowerCase());
  }

  @Ref() newItemComponent!: NewItemComponent;
  @Ref() editItemComponent!: EditItemComponent;

  //newItem用のモーダルの表示
  openNewItemDialog() {
    this.newItemComponent.openNewItemDialog();
  }

  //editItem用のモーダルの表示
  openEditItemDialog(item: Content) {
    this.editItemComponent.openEditItemDialog(item);
  }

  async deleteItem(content_id: string) {
    const result = confirm("本当に消去しますか。");
    if (result) {
      await deleteDoc(doc(db, "contents", content_id));
      await this.setContents();
    }
  }

  //ストア更新
  async setContents() {
    const contentRef = collection(db, "contents");
    const contentQuerySnapshot = await getDocs(contentRef);
    const contents = contentQuerySnapshot.docs.map((doc) => {
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

  mounted() {
    this.setContents();
  }
}
</script>
