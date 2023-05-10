import { createLocalVue, shallowMount } from "@vue/test-utils";
import VoteViewComponent from "@/views/VoteView.vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Vuex from "vuex";
import "../../src/firebase/firebase";

//vuetifyの警告回避
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();
let vuetify: any;
localVue.use(Vuex);
let getters: any;
let store: any;
let isUsersVotesCollection: boolean;
let successMessage: any;

beforeEach(() => {
  vuetify = new Vuetify();
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

//選んでいるプラン
const selectedPlan = {
  id: 1,
};

describe("VoteView.vue", () => {
  it("【失敗】投票済みであれば、アラートが表示されるかどうか", async () => {
    //投票済判定
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        selectedPlan,
        isUsersVotesCollection,
      },
      store,
      methods: {
        getPlans: jest.fn(),
        insertUsersVote: jest.fn(),
        insertPublicVote: jest.fn(),
      },
      computed: {
        isCurrentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
      },
    });

    //投票するプランの情報を入れる
    await wrapper.setData({ isUsersVotesCollection: true });
    await wrapper.setData({ selectedPlan: selectedPlan });

    //@clickで発火する関数の発火
    const vm: any = wrapper.vm;
    await vm.insertVote();
    expect(
      wrapper
        .findAllComponents({ name: "v-alert" })
        .filter((w) => w.attributes("type") == "error")
        .at(0)
        .text()
    ).toBe("既に投票すみです。");
  });
  it("【失敗】未ログイン時、注意メッセージが表示される", async () => {
    //投票済判定
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        selectedPlan,
        isUsersVotesCollection,
      },
      store,
      methods: {
        getPlans: jest.fn(),
        insertUsersVote: jest.fn(),
        insertPublicVote: jest.fn(),
      },
    });

    //投票するプランの情報を入れる
    await wrapper.setData({ selectedPlan: selectedPlan });

    //@clickで発火する関数の発火
    const vm: any = wrapper.vm;
    await vm.insertVote();

    expect(
      wrapper
        .findAllComponents({ name: "v-alert" })
        .filter((w) => w.attributes("type") == "warning")
        .at(0)
        .text()
    ).toBe("投票するには会員登録が必要です。こちらより会員登録をお願いします。");
  });

  it("【成功】ログイン中かつ初回の投稿の時", async () => {
    //投票済判定
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        selectedPlan,
        isUsersVotesCollection,
        successMessage,
      },
      store,
      computed: {
        isCurrentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
      },
      methods: {
        getPlans: jest.fn(),
        insertUsersVote: jest.fn(),
        insertPublicVote: jest.fn(),
      },
    });

    //投票するプランを選択
    await wrapper.setData({ selectedPlan: selectedPlan });
    await wrapper.setData({ isUsersVotesCollection: false });

    //擬似的にsuccessMessageを挿入
    await wrapper.setData({ successMessage: "投票が完了しました。" });

    //@clickで発火する関数の発火
    const vm: any = wrapper.vm;
    await vm.insertVote();

    expect(
      wrapper
        .findAllComponents({ name: "v-alert" })
        .filter((w) => w.attributes("type") == "success")
        .at(0)
        .text()
    ).toBe("投票が完了しました。");
  });
});
