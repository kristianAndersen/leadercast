<template>  
  <input type="url"
  @input="validateUrl" 
  class="m-1 border bg-white rounded-lg p-2 w-5/6" placeholder="Enter URL (e.g., example.com)" :v-model="urlvalue">
</template>


<script>
import { defineComponent,ref } from 'vue';

export default defineComponent({
  name: 'UrlInput',
  emits: ['update:url'], // Declare emittable events
  setup(props, { emit }) {

    const urlvalue = ref('');
    const validateUrl = (evt) => {
 
      emit('update:url',evt.target.value);
  
    };

    return {
      validateUrl,
      urlvalue
    };
  },
});
</script>