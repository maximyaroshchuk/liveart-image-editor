import type { InjectionKey } from 'vue'

export const FILE_DIALOG_KEY: InjectionKey<() => void> = Symbol('openFileDialog')
