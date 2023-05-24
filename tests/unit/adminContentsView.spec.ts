import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Vuex from "vuex";
import "../../src/firebase/firebase";
import AdminContents from "@/views/AdminContents.vue";

//vuetifyの警告回避
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();
let vuetify: any;
localVue.use(Vuex);
let getters: any;
let store: any;
beforeEach(() => {
  vuetify = new Vuetify();
  getters = {
    currentUser: () => null,
  };
  store = new Vuex.Store(getters);
});

const contents = [
  { title: "Title 0", description: "Description 0" },
  { title: "Title 1", description: "Description 1" },
  { title: "Title 2", description: "Description 2" },
  { title: "Title 3", description: "Description 3" },
  { title: "Title 4", description: "Description 4" },
  { title: "Title 5", description: "Description 5" },
  { title: "Title 6", description: "Description 6" },
  { title: "Title 7", description: "Description 7" },
  { title: "Title 8", description: "Description 8" },
  { title: "Title 9", description: "Description 9" },
];

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
}));

const headers = {
  mobile: false,
};

//投票済判定
const wrapper = mount(AdminContents, {
  localVue,
  vuetify,
  router,
  propsData: { headers },
  store,
  methods: {
    getPlans: jest.fn(),
    insertUsersVote: jest.fn(),
    insertPublicVote: jest.fn(),
    setContents: jest.fn(() => {
      contents;
    }),
  },
  stubs: {
    "v-btn": true,
    "v-dialog": true,
    // "v-data-table": VDataTable,
  },
  computed: {
    isCurrentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
    // headers: () => {
    //   [
    //     {
    //       text: "タイトル",
    //       value: "title",
    //     },
    //     { text: "説明", value: "description" },
    //     { text: "操作", value: "actions" },
    //   ];
    // },
  },
});

describe("AdminContents.vue", () => {
  it("レンダリングされるかどうか", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("contentsがあった時、v-data-tableのレンダリングされるかどうか", async () => {
    console.log(wrapper.html());
  });
});
