import { createLocalVue, shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Vuex from "vuex";
import { state } from "@/store/state";
import { getters } from "@/store/getters";
const localVue = createLocalVue();
localVue.use(Vuex);
let store: any;
beforeEach(() => {
  store = new Vuex.Store({
    state: state,
    getters: getters,
  });
});

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      localVue,
      store,
      propsData: { msg },
    });

    const result = getters.currentCount(state);
    expect(wrapper.text()).toMatch(msg);
    expect(result).toBe(0);
  });
});
