import { createLocalVue, RouterLinkStub, shallowMount } from "@vue/test-utils";
import AppComponent from "@/App.vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { getAuth } from "firebase/auth";
import "../../src/firebase/firebase";

jest.mock("firebase/auth", () => {
  const auth = {
    onAuthStateChanged: jest.fn(),
  };

  return {
    getAuth: jest.fn().mockImplementation(() => auth),
  };
});

describe("MyComponent.vue", () => {
  const auth = getAuth();
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("signOutEventメソッドが期待通りの動作をすること", async () => {
    const wrapper = shallowMount(AppComponent, {
      localVue,
      vuetify,
      router,
      stubs: {
        RouterLink: RouterLinkStub,
      },
      data() {
        return {
          auth,
        };
      },

      mocks: {
        $store: {
          getters: { isAuth: true, isCurrentUser: { name: "test太郎" } },
        },
      },
    });
    //リンク遷移のテスト
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/");
  });
});
