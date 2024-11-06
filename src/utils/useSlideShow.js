import { ref } from 'vue';

export function useSlideShow() {
  const initializeReceiver = async () => {
    const context = cast.framework.CastReceiverContext.getInstance();
    const options = new cast.framework.CastReceiverOptions();
    
    options.customNamespaces = {
      'urn:x-cast:com.slideit.app': cast.framework.system.MessageType.JSON
    };

    context.start(options);
    return context;
  };

  return {
    initializeReceiver
  };
}

