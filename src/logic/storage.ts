import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageCopy = useWebExtensionStorage('copy-info', []);

export const optionsStorage = useWebExtensionStorage('options', { 
  'auto-clear-last': false,
  'visible-open-button': true
});
