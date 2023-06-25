<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'
import { getCurrentUser, useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword } from 'firebase/auth'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext';

import { useToastWrapper } from '../../composables/useToastWrapper'
import { useUserStore } from '../../stores/user'
import { storeToRefs } from 'pinia'

const toast = useToastWrapper()

const emailRef = ref()

const router = useRouter()
const { setCurrentUser } = useUserStore()
const { currentUser } = storeToRefs(useUserStore())

useFocus(emailRef, { initialValue: true })

const validationSchema = object({
  email: string().required('This field is empty').email('Not a valid email').label('Email'),
  password: string().required('This field is empty').label('Password')
})

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: null,
    password: null
  }
})

const { value: email, errorMessage: emailError} = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    const res = await signInWithEmailAndPassword(useFirebaseAuth(), values.email, values.password)
    if (res) {
      const user = await getCurrentUser()
      setCurrentUser(user)
      router.push('/')
    }
  } catch(e) {
    toast("Wrong email or password", "Login Unsuccessful", 'error')
    resetForm()
  }
})

onMounted(() => {
  if (currentUser.value) {
    console.log('hello')
    router.push('/')
  }
})

</script>

<template>
  <div class="d-flex justify-content-center text-black">
    <div class="p-5 bg-white border border-dark">
      <img src="../../assets/logo.png" class="mg-fluid mx-auto d-block w-25 mb-4" height="90">
      <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label for="email" class="d-block">Email</label>
        <InputText ref="emailRef" 
                    id="email" 
                    v-model="email" 
                    class="d-block demo-el" 
                    placeholder="Email"
                    size="40"
        />
        <small class="text-danger" id="email-help">{{ emailError }}</small>
      </div>

      <div class="mb-4">
        <label for="password" class="d-block">Password</label> 
        <InputText  id="password" 
                    v-model="password" 
                    class="d-block demo-el" 
                    type="password" 
                    placeholder="Password"
                    size="40"
          />
        <small class="text-danger" id="password-help">{{ passwordError }}</small>
      </div>
      
      <div class="d-flex justify-content-between mb-3">
        <Button class="mb-2" type="submit" label="Log in" size="small" />
        <p class="m-2"><a href="/register">Forgot password?</a></p>
      </div>
      
      <p>Don't have an account? Register <a href="/register">here</a></p>
    </form>
    </div>
  </div>
</template>
