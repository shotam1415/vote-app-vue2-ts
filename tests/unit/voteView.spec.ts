import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import VoteViewComponent from "@/views/VoteView.vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import "../../src/firebase/firebase";

//vuetifyのコンポーネントとVuexを読み込めるようにする
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

//storeの定義
let getters: any;
let store: any;
beforeEach(() => {
  getters = {
    currentUser: () => null,
  };
  store = new Vuex.Store(getters);
});

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(() => ""),
  runTransaction: jest.fn(),
  doc: jest.fn(),
  Transaction: jest.fn(),
}));

describe("VoteView.vue", () => {
  it("successMessageに値が入ったら表示されるかどうか", async () => {
    const successMessage = "投票が完了しました。";
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      propsData: { successMessage },
      store,
      methods: {
        getPlans: jest.fn(),
      },
      computed: {
        currentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
      },
    });

    const vm: any = wrapper.vm;

    await vm.showVotedMessage("success", successMessage);

    const result = wrapper
      .findAllComponents({ name: "v-alert" })
      .filter((w) => w.attributes("type") == "success")
      .at(0)
      .text();

    expect(result).toBe(successMessage);
  });
});
