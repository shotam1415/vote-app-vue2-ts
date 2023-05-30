// import { createLocalVue, shallowMount } from "@vue/test-utils";
// import SignInView from "@/views/SignInView.vue.vue";
// import VueRouter from "vue-router";
// import Vuex from "vuex";
// import "../../src/firebase/firebase";
// import firebase from "../firebase";

// const auth = firebase.auth();
// const db = firebase.firestore();

//vuetifyのコンポーネントとVuexを読み込めるようにする
// const localVue = createLocalVue();
// localVue.use(VueRouter);
// localVue.use(Vuex);

//storeの定義
// let getters: any;
// let store: any;
// beforeEach(() => {
//   getters = {
//     currentUser: () => null,
//   };
//   store = new Vuex.Store(getters);
// });

// jest.mock("firebase/firestore", () => ({
//   getFirestore: jest.fn(),
//   collection: jest.fn(),
//   getDocs: jest.fn(() => ""),
//   runTransaction: jest.fn(),
//   doc: jest.fn(),
//   Transaction: jest.fn(),
// }));

// const wrapper = shallowMount(SignInView, {
//   localVue,
//   store,
//   propsData: {
//     db,
//     auth,
//   },
//   methods: {
//     getPlans: jest.fn(),
//   },
//   computed: {
//     currentUser: () => ({ id: "", name: "" }),
//   },
// });
// const vm: any = wrapper.vm;

// describe("VoteView.vue", () => {
//   it("【正常系】showVotedMessageのsuccessMessage", async () => {
//     const message = "投票が完了しました。";

//     await vm.showVotedMessage("success", message);

//     const result = wrapper
//       .findAllComponents({ name: "v-alert" })
//       .filter((w) => w.attributes("type") == "success")
//       .at(0)
//       .text();

//     expect(result).toBe(message);
//   });
// });
