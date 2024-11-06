<template>
  <div class="w-full h-full relative  rounded-lg overflow-hidden">
  <iframe  :src="frameSrc" frameborder="0" loading="lazy"  class="responsive-iframe h-full bg-white" scrolling="no"></iframe>
  </div>
</template>

<script>
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'IframeIt',
  props: {
    src: {
      type: URL,
      required: true,
    },
  },
  setup(props) {
    
    const frameSrc=props.src;
    
    return {
      frameSrc
    };
  },
});
</script>

<style scoped>

.responsive-iframe {
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9; /* Adjust as needed */
  border: none;
}
</style>