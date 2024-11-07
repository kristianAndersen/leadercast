// useChromecast.js
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useChromecast() {
  const APP_ID = '64F29018'
  const NAMESPACE = 'urn:x-cast:com.screeninfo.app'
  
  // Reactive references
  const castSession = ref(null)
  const status = ref('Initializing...')
  const screenInfo = ref(null)
  const isConnected = ref(false)
  const isAvailable = ref(false)
  let pollInterval;
  // Initialize Cast API when it becomes available
  const initializeCastApi = () => {
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    })

    // Add session listener
    cast.framework.CastContext.getInstance().addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      event => {
        if (event.sessionState === cast.framework.SessionState.SESSION_STARTED) {
          castSession.value = cast.framework.CastContext.getInstance().getCurrentSession()
          status.value = 'Connected to Chromecast'
          isConnected.value = true
        } else if (event.sessionState === cast.framework.SessionState.SESSION_ENDED) {
          isConnected.value = false
          castSession.value = null
          screenInfo.value = null
        }
      }
    )
  }

  // Connect to receiver
  const connectToReceiver = async () => {
    try {
      status.value = 'Connecting to Chromecast...'
      await cast.framework.CastContext.getInstance().requestSession()
    } catch (error) {
      status.value = `Connection failed: ${error.message}`
      throw error
    }
  }

  // Request screen information
  const requestScreenInfo = async (data) => {
    if (!castSession.value) {
        status.value = 'Not connected to Chromecast';
        return;
    }

    try {
        await castSession.value.sendMessage(NAMESPACE, { command: 'getScreenInfo', data: data });
        status.value = 'Screen info requested';

        // Add listener for response if not already added
        castSession.value.addMessageListener(NAMESPACE, (namespace, message) => {
            console.log("Message received from receiver:", message);
            const data = JSON.parse(message);
            console.log("Data received from receiver:", data);
            screenInfo.value = data.data;
        });
    } catch (error) {
        status.value = `Error requesting screen info: ${error.message}`;
        throw error;
    }
}


  // Stop casting
  const stopCasting = async () => {
    if (castSession.value) {
      try {
        await castSession.value.endSession(true)
        status.value = 'Casting stopped'
        castSession.value = null
        screenInfo.value = null
        isConnected.value = false
      } catch (error) {
        status.value = `Error stopping cast: ${error.message}`
        throw error
      }
    }
  }

  // Setup cast API when it becomes available
  
  const checkCastApi = () => {
    if (window.__onGCastApiAvailable) {
      clearInterval(pollInterval);
      isAvailable.value = true;
      status.value = 'Cast API available';
      initializeCastApi();
    }
  };

  onMounted(() => {
    // Poll every 500ms until Cast API is available
    pollInterval = setInterval(checkCastApi, 500);
  });

  onBeforeUnmount(() => {
    // Clear interval when component unmounts
    if (pollInterval) clearInterval(pollInterval);
  });
  
 

  // Return the public interface
  return {
    // State
    status,
    screenInfo,
    isConnected,
    isAvailable,
    
    // Methods
    connectToReceiver,
    requestScreenInfo,
    stopCasting
  }
}