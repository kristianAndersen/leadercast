/*** ChromecastReceiver.vue ***/
<template>
  <div class="receiver-view">
    <div id="debug" class="debug">{{ latestLog }}</div>
    <div id="iframewrapper" class="slideshow-wrapper"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

// Constants
const NAMESPACE = 'urn:x-cast:com.screeninfo.app';

// Classes
class IframeScaler {
  constructor(config = {}) {
    this.config = {
      targetWidth: config.targetWidth || 2394,
      targetHeight: config.targetHeight || 1241,
      overscan: config.overscan || [0, 0, 0, 0],
      rotation: config.rotation || 0
    };
    
    this.initialize();
  }

  initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .scaled-frame-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: center center;
      }
      .scaled-frame {
        border: none;
        transform-origin: 0 0;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
    document.head.appendChild(style);

    this.container = document.createElement('div');
    this.container.className = 'scaled-frame-container';
    
    this.iframe = document.createElement('iframe');
    this.iframe.className = 'scaled-frame';
    
    this.container.appendChild(this.iframe);
    document.body.appendChild(this.container);

    window.addEventListener('resize', () => this.updateScaling());
    this.updateScaling();
  }

  getViewportDimensions() {
    const overscan = this.config.overscan;
    return {
      width: document.body.clientWidth - overscan[1] - overscan[3],
      height: document.body.clientHeight - overscan[0] - overscan[2]
    };
  }

  updateScaling() {
    const viewport = this.getViewportDimensions();
    const target = {
      width: this.config.targetWidth,
      height: this.config.targetHeight
    };

    this.iframe.style.width = `${target.width}px`;
    this.iframe.style.height = `${target.height}px`;

    const scaleX = viewport.width / target.width;
    const scaleY = viewport.height / target.height;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = target.width * scale;
    const scaledHeight = target.height * scale;

    this.container.style.width = `${scaledWidth}px`;
    this.container.style.height = `${scaledHeight}px`;
    this.container.style.marginLeft = `${-scaledWidth / 2}px`;
    this.container.style.marginTop = `${-scaledHeight / 2}px`;

    const isRotated = this.config.rotation % 180 === 90;
    if (isRotated) {
      const rotatedScale = Math.min(viewport.height / target.width, viewport.width / target.height);
      this.iframe.style.transform = `rotate(${this.config.rotation}deg) scale(${rotatedScale})`;
    } else {
      this.iframe.style.transform = `scale(${scale})`;
    }

    const [top, right, bottom, left] = this.config.overscan;
    document.body.style.margin = `${top}px ${right}px ${bottom}px ${left}px`;
  }

  setUrl(url) {
    try {
      const urlObj = new URL(url);
      const finalUrl = urlObj.origin + urlObj.pathname + urlObj.search + urlObj.hash;
      
      this.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
      this.iframe.setAttribute('allow', 'fullscreen');
      this.iframe.src = finalUrl;
      
      this.iframe.onload = () => {
        log('iframe loaded successfully');
      };
      
      this.iframe.onerror = (error) => {
        log('iframe loading error:', error);
      };
    } catch (error) {
      log('URL parsing error:', error);
      this.iframe.src = url;
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.updateScaling();
  }
}

class IframeSlideshow {
  constructor(urls, config = {}) {
    this.urls = urls;
    this.currentIndex = 0;
    this.scalers = [];
    this.transitionTime = config.transitionTime || 10000;
    
    this.scalerConfig = {
      targetWidth: config.targetWidth || 2394,
      targetHeight: config.targetHeight || 1241,
      overscan: config.overscan || [0, 0, 0, 0],
      rotation: config.rotation || 0
    };
    
    this.initialize();
  }

  initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .slideshow-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .slide-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        transition: opacity 1s ease-in-out;
        z-index: 1;
      }
      .slide-container.active {
        opacity: 1;
        pointer-events: auto;
        z-index: 2;
      }
      .scaled-frame-container {
        z-index: inherit;
      }
    `;
    document.head.appendChild(style);

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'slideshow-wrapper';
    document.body.appendChild(this.wrapper);

    this.urls.forEach((url, index) => {
      const slideContainer = document.createElement('div');
      slideContainer.className = 'slide-container';
      if (index === 0) slideContainer.classList.add('active');
      this.wrapper.appendChild(slideContainer);

      const scaler = new IframeScaler({
        ...this.scalerConfig
      });
      
      slideContainer.appendChild(scaler.container);
      scaler.setUrl(url);
      
      this.scalers.push({
        scaler,
        container: slideContainer
      });
    });

    this.startSlideshow();
    
    window.addEventListener('resize', () => {
      this.scalers.forEach(({scaler}) => scaler.updateScaling());
    });
  }

  showSlide(index) {
    this.scalers.forEach(({container}) => {
      container.classList.remove('active');
    });
    
    this.scalers[index].container.classList.add('active');
    this.scalers[index].scaler.updateScaling();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.urls.length;
    this.showSlide(this.currentIndex);
  }

  startSlideshow() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.nextSlide(), this.transitionTime);
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  resume() {
    if (!this.interval) {
      this.startSlideshow();
    }
  }

  updateConfig(newConfig) {
    this.scalerConfig = { ...this.scalerConfig, ...newConfig };
    this.scalers.forEach(({scaler}) => {
      scaler.updateConfig(this.scalerConfig);
    });
  }

  cleanup() {
    this.pause();
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }
}

export default {
  name: 'ChromecastReceiver',
  
  setup() {
    // State
    const startTime = ref(Date.now());
    const latestLog = ref('Starting Chromecast Receiver...');
    let slideshow = null;

    // Logging utility
    const log = (message) => {
      const time = ((Date.now() - startTime.value) / 1000).toFixed(1);
      const logMessage = `[${time}s] ${message}`;
      latestLog.value = logMessage + '\n' + latestLog.value;
      console.log(logMessage); // Also log to console for debugging
    };

    // Handle adding iframes
    const addIframes = (urls) => {
      log('Setting up slideshow with URLs: ' + JSON.stringify(urls));
      
      // Cleanup existing slideshow if any
      if (slideshow) {
        slideshow.cleanup();
      }

      slideshow = new IframeSlideshow(urls, {
        targetWidth: 2500,
        targetHeight: 1400,
        transitionTime: 30000,
        overscan: [0, 0, 0, 0],
        rotation: 0
      });
    };

    // Initialize Chromecast receiver
    const initializeReceiver = () => {
      try {
        log('Initializing Chromecast receiver...');
        const context = cast.framework.CastReceiverContext.getInstance();
        context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

        const options = new cast.framework.CastReceiverOptions({
          customNamespaces: {
            'urn:x-cast:com.custom.message': cast.framework.system.MessageType.STRING
          },
          disableIdleTimeout: true,
          skipPlaybackOnError: false
        });

        // Set up event listeners
        context.addEventListener(cast.framework.system.EventType.READY, () => {
          log('System is ready');
        });

        context.addEventListener(cast.framework.system.EventType.SENDER_CONNECTED, event => {
          log('Sender connected: ' + event.senderId);
        });

        context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED, event => {
          log('Sender disconnected: ' + event.senderId);
        });

        context.addEventListener(cast.framework.system.EventType.ERROR, event => {
          log('Error: ' + JSON.stringify({
            code: event.errorCode,
            reason: event.reason,
            customData: event.customData
          }));
        });

        context.addEventListener(cast.framework.system.EventType.SHUTDOWN, () => {
          log('Receiver shutting down');
        });

        // Handle custom messages
        context.addCustomMessageListener(NAMESPACE, event => {
          log('Message received: ' + JSON.stringify(event.data));
          
          const { command, data } = event.data;
          
          if (command === 'getScreenInfo') {
            log('Processing screen info request');
            context.sendCustomMessage(NAMESPACE, event.senderId, {
              type: 'screenInfo',
              data
            });
            addIframes(data);
          } else {
            log(`Unknown command: ${command}`);
          }
        });
     
        // Start the receiver
        log('Starting receiver context...');
        context.start(options);
        log('Receiver started and awaiting connections');

      } catch (error) {
        log('CRITICAL ERROR: ' + error.message);
        console.error('Full error:', error);
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      log('Component mounted');
      // Check for Cast API availability
      if (window.cast && window.cast.framework) {
        initializeReceiver();
      } else {
        log('ERROR: Cast API not available');
        const maxRetries = 5;
        let retryCount = 0;
        
        const checkCastAPI = setInterval(() => {
          if (window.cast && window.cast.framework) {
            clearInterval(checkCastAPI);
            initializeReceiver();
          } else if (retryCount >= maxRetries) {
            clearInterval(checkCastAPI);
            log('ERROR: Cast API failed to load after retries');
          }
          retryCount++;
        }, 1000);
      }
    });

    onUnmounted(() => {
      log('Component unmounting - cleaning up');
      if (slideshow) {
        slideshow.cleanup();
      }
    });

    // Expose necessary data to template
    return {
      latestLog
    };
  }
};
</script>

<style>
/* Base styles */
.receiver-view {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Debug overlay */
.debug {
  color: #fff;
  z-index: 1000;
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  word-wrap: break-word;
  font-size: 10px;
  white-space: pre-wrap;
  font-family: monospace;
}

/* Iframe wrapper */
.slideshow-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>