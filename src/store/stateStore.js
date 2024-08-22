import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStateStore = defineStore('state', () => {
  const nickname = ref('')
  const exp = ref('')
  const status = ref('')
  const token = ref('')

  return { nickname, exp, status, token }
})
