import { createLocalVue, shallowMount } from "@vue/test-utils";
import VoteViewComponent from "@/views/VoteView.vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";

describe("VoteView.vue", () => {
  //vuetifyの警告回避
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  beforeEach(() => {
    vuetify = new Vuetify();
  });

  //選んでいるプラン
  const selectedPlan = {
    id: 1,
  };

  let isUsersVotesCollection: boolean;

  it("投票済みであれば、アラートが表示されるかどうか", async () => {
    //投票済判定
    const isUsersVotes = jest.fn(() => true);
    const wrapper = shallowMount(VoteViewComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        selectedPlan,
        isUsersVotesCollection,
      },
    });

    isUsersVotesCollection = isUsersVotes();

    //投票するプランを選択
    await wrapper.setData({ selectedPlan: selectedPlan });
    await wrapper.findComponent({ name: "v-btn" }).trigger("click");
    expect(
      wrapper
        .findAllComponents({ name: "v-alert" })
        .filter((w) => w.attributes("type") == "error")
        .at(0)
        .text()
    ).toBe("既に投票すみです。");
  });
});
