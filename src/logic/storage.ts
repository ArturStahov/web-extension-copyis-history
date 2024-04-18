import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageCopy = useWebExtensionStorage('copy-info', []);

export const optionsStorage = useWebExtensionStorage('options', { memory: {
  'auto-clear-last': false
}});
