import { shallowMount } from "@vue/test-utils";
import AppComponent from "@/App.vue";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import "../../src/firebase/firebase";

jest.mock("firebase/auth", () => {
  // FirebaseのsignOutメソッドをモック化
  return {
    signOut: jest.fn(),
  };
});

describe("MyComponent.vue", () => {
  it("signOutEventメソッドが期待通りの動作をすること", async () => {
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
    };
    // const auth = getAuth();
    // const userCredential = await signInWithEmailAndPassword(auth, "admin@sample.com", "88888888");
    // userCredential.user;

    const wrapper = shallowMount(AppComponent, {
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
        $router: {
          push: jest.fn(),
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await wrapper.vm.signOutEvent();
    expect(signOut).toHaveBeenCalledWith(auth);

    // $store.commitと$router.pushが呼ばれることを検証
    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith("setCurrentUser", null);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/signin");
  });
});
