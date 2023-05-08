import { shallowMount } from "@vue/test-utils";
import AppComponent from "@/App.vue";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import "../../src/firebase/firebase";
import Vuetify from "vuetify";
import { createLocalVue, RouterLinkStub } from "@vue/test-utils";
import VueRouter from "vue-router";

jest.mock("firebase/auth", () => {
  const auth = {
    updated_at: {
      seconds: 1682953200,
      nanoseconds: 541000000,
    },
    name: "admin",
    email: "admin@sample.com",
    created_at: {
      seconds: 1682953200,
      nanoseconds: 829000000,
    },
    role: 0,
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
          commit: jest.fn(),
          getters: { isAuth: true },
        },
        // $router: {
        //   push: jest.fn(),
        // },
      },
    });
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/");
  });
});
