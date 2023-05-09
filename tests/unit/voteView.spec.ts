import { createLocalVue, shallowMount } from "@vue/test-utils";
import VoteViewComponent from "@/views/VoteView.vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Vuex from "vuex";

//vuetifyの警告回避
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();
let vuetify: any;
beforeEach(() => {
  vuetify = new Vuetify();
});
localVue.use(Vuex);
let getters: any;
let store: any;
let isUsersVotesCollection: boolean;

beforeEach(() => {
  getters = {
    currentUser: () => null,
  };
  store = new Vuex.Store(getters);
});

//選んでいるプラン
const selectedPlan = {
  id: 1,
};

describe("VoteView.vue", () => {
  it("投票済みであれば、アラートが表示されるかどうか", async () => {
    //投票済判定
    // const isUsersVotes = jest.fn(() => false);
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        selectedPlan,
        isUsersVotesCollection,
      },
      store,
      computed: {
        isCurrentUser: () => ({ id: "9r3AALbDGogMCH9sz0Hk", name: "test" }),
      },
    });

    //投票するプランを選択
    await wrapper.setData({ selectedPlan: selectedPlan });
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
  it("未ログイン時、注意メッセージが表示される", async () => {
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
    });

    //投票するプランを選択
    await wrapper.setData({ selectedPlan: selectedPlan });
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
});
