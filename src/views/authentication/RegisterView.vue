<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { object, string } from 'yup'
import { getCurrentUser, useFirebaseAuth } from 'vuefire'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext';

import { useToastWrapper } from '../../composables/useToastWrapper'
import { useUserStore } from '../../stores/user'
import { storeToRefs } from 'pinia'

const emailRef = ref()

const toast = useToastWrapper()

const { setCurrentUser } = useUserStore()
const { currentUser } = storeToRefs(useUserStore())
const router = useRouter()

useFocus(emailRef, { initialValue: true })

const validationSchema = object({
  email: string().required('This field is empty').email('Not a valid email'),
  password: string().required('This field is empty').min(8),
  confirmPassword: string().required('This field is empty').oneOf([yup.ref('password'), null], 'Your passwords do not match.')
})

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: null,
    password: null,
    confirmPassword: null
  }
})

const { value: email, errorMessage: emailError} = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword')

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  console.log(values.email, values.password)
  try {
    const res = await createUserWithEmailAndPassword(useFirebaseAuth(), values.email, values.password)
    if (res){
      const user = await getCurrentUser()
      setCurrentUser(user)
      router.push('/')
    }
  } catch(e) {
    toast(e.message, "Register Unsuccessful", 'error')
  }
})

onMounted(() => {
  if (currentUser.value) {
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

      <div class="mb-3">
        <label for="password" class="d-block">Password</label>
        <InputText id="password" 
                    v-model="password" 
                    class="d-block demo-el" 
                    type="password" 
                    placeholder="Password"
                    size="40"
        />
        <small class="text-danger" id="password-help">{{ passwordError }}</small>
      </div>

      <div class="mb-4">
        <label for="passwordConfirmation" class="d-block">Confirm Password</label>
        <InputText  id="passwordConfirmation" 
                    v-model="confirmPassword" 
                    class="d-block demo-el" 
                    type="password" 
                    placeholder="Confirm Password"
                    size="40"
        />
        <small class="text-danger" id="password-help">{{ confirmPasswordError }}</small>
      </div>
      
      <Button class="mb-2" type="submit" label="Sign up" size="small" />
      
      <p>Already have an account? Login <a href="/login">here</a></p>
    </form>
    </div>
  </div>
</template>