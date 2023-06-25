import { useToast } from 'primevue/usetoast'

export function useToastWrapper() {
  const primetoast = useToast()

  return function toast(message, title = null, severity = 'info', opts= {}) {
    primetoast.add({severity: severity, summary: title, detail: message, life: 3000, ...opts})
  }
}