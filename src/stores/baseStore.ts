import { defineStore, acceptHMRUpdate } from 'pinia';

export const baseStore = defineStore('baseStore', () => {});
// make sure to pass the right store definition, `baseStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(baseStore, import.meta.hot));
}
