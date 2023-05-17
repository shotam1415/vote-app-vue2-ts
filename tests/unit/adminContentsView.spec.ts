import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Vuex from "vuex";
import "../../src/firebase/firebase";
import AdminContentsView from "@/views/AdminContentsView.vue";

//vuetifyの警告回避
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();
let vuetify: any;
localVue.use(Vuex);
let getters: any;
let store: any;
let contents;

beforeEach(() => {
  vuetify = new Vuetify();
  getters = {
    currentUser: () => null,
  };
  store = new Vuex.Store(getters);
});

const contentsObject = [
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

describe("AdminContentsView.vue", () => {
  it("レンダリングされるかどうか", async () => {
    //投票済判定
    const wrapper = shallowMount(AdminContentsView, {
      localVue,
      vuetify,
      router,
      propsData: {},
      store,
      methods: {
        getPlans: jest.fn(),
        insertUsersVote: jest.fn(),
        insertPublicVote: jest.fn(),
        setContents: jest.fn(() => {
          contents = contentsObject;
        }),
      },
      computed: {
        isCurrentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
