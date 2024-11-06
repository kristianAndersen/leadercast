<script>
import { RouterView } from 'vue-router';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  setup() {
 


    return {
      RouterView,
     
    };
  },
});
</script>

<template>
  <main class="mx-auto flex h-full w-full flex-col items-center p-5">
 
    <RouterView/>

  </main>
</template>

<style scoped></style>
