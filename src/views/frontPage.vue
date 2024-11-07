<template>
  <h1 class="text-white font-bold text-lg">SlideIt</h1>
<h2  class="text-white font-bold text-lg">{{ status }}</h2>
  <div class="flex flex-row text-white items-center">
    <div
      role="button"
      @click="addInput"
      class="addremove rounded-full bg-white w-8 h-8 text-center text-black flex justify-center items-center font-bold mt-2 mb-2">
      +
    </div>
    <p class="ms-2">Add URL input</p>
  </div>

  <section class="flex flex-col w-full">
    <div
      v-for="(urlItem, index) in urls"
      :key="index"
      class="flex flex-row justify-evenly items-center">
      <UrlInput v-model:url="urlItem.url" data-id="index" />
      <div
        role="button"
        @click="removeInput(index)"
        class="addremove rounded-full bg-white w-8 h-8 text-center text-black flex justify-center items-center font-bold">
        -
      </div>
    </div>
  </section>
  <div
    role="button"
    @click="castIt"
    class="addremove bg-white text-black p-2 rounded-lg mt-2"
  >
    <p>Cast slides to TV</p>
  </div>
  <section class="flex flex-row w-full justify-between">
    <div
      v-for="(vurlItem, index) in validUrls"
      :key="index">
      <IframeIt :src="vurlItem" />
      </div>
  
  </section>

</template>


<script>
import { defineComponent, ref, watch, onMounted } from 'vue';
import IframeIt from '@/components/IframeIt.vue';
import UrlInput from '@/components/UrlInput.vue';
import UrlSanitizer from '@/utils/UrlSanitizer';

import { useChromecast } from '@/composables/useChromecast'

export default defineComponent({
  name: 'frontPage',
  components: {
    IframeIt,
    UrlInput,
  },

  setup(props) {
    
    
    const urls = ref([{ url: '' }]); // Initialize with one input
    const validUrls = ref([]);
    

    const {
      status,
      screenInfo,
      isConnected,
      isAvailable,
      connectToReceiver,
      requestScreenInfo,
      stopCasting
    } = useChromecast()



    const addInput = () => {
      urls.value.push({ url: '' }); // Add new URL object
    };

    const removeInput = (index) => {
      urls.value.splice(index, 1); // Remove the input at the specified index
    };
   
    watch(() => urls.value.map(item => item.url), (newUrls, oldUrls) => {
  newUrls.forEach((url, index) => {
    if (url !== oldUrls[index]) {
      console.log(`URL ${index} changed from ${oldUrls[index]} to ${url}`);
    }
    });
  }, { deep: true });


    const castIt = () => {
      urls.value.forEach((urlItem, index) => {
        validUrls.value[index] = UrlSanitizer(urlItem.url);
        console.log(`Input ${index + 1}: ${ validUrls.value[index]}`);
      //cast to TV
      connectToReceiver()
  
      });
    };

    watch(status, (newInfo) => {
      if (newInfo === 'Connected to Chromecast') {
        console.log('New screen info received:', newInfo)
        requestScreenInfo(validUrls.value);
      }
    })




    return {
      addInput,
      removeInput,
      urls,
      validUrls,
      status,
      castIt,
    };
  },
});
</script>
