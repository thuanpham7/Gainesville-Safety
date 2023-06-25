import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  const setCurrentUser = user => {
    const formUser = {
      email: user.email,
      token: user.stsTokenManager
    }
    // To do: create cookie session
    
    localStorage.setItem('user', JSON.stringify(formUser))
    currentUser.value = formUser
  }

  const removeCurrentUser = async () => {
    await signOut(useFirebaseAuth())
    const user = await getCurrentUser()
    if (!user) {
      localStorage.removeItem('user')
      currentUser.value = null
    }
  }

  return {
    currentUser,
    setCurrentUser,
    removeCurrentUser
  }
})