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

const wrapper = shallowMount(VoteViewComponent, {
  localVue,
  store,
  methods: {
    getPlans: jest.fn(),
  },
  computed: {
    currentUser: () => ({ id: "", name: "" }),
  },
});
const vm: any = wrapper.vm;

describe("VoteView.vue", () => {
  it("【正常系】showVotedMessageのsuccessMessage", async () => {
    const message = "投票が完了しました。";

    await vm.showVotedMessage("success", message);

    const result = wrapper
      .findAllComponents({ name: "v-alert" })
      .filter((w) => w.attributes("type") == "success")
      .at(0)
      .text();

    expect(result).toBe(message);
  });
  it("【正常系】showVotedMessageのwarningMessage", async () => {
    const message = "投票するには会員登録が必要です。";
    const holdMessage = "こちらより会員登録をお願いします。";

    await vm.showVotedMessage("warning", message);

    const result = wrapper
      .findAllComponents({ name: "v-alert" })
      .filter((w) => w.attributes("type") == "warning")
      .at(0)
      .text();

    expect(result).toBe(message + holdMessage);
  });
  it("【正常系】showVotedMessageのerrorMessage", async () => {
    const message = "投票エラーです。";

    await vm.showVotedMessage("error", message);

    const result = wrapper
      .findAllComponents({ name: "v-alert" })
      .filter((w) => w.attributes("type") == "error")
      .at(0)
      .text();

    expect(result).toBe(message);
  });
});
