<script setup>
import dayjs from 'dayjs'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Fieldset from 'primevue/fieldset'
import ProgressSpinner from 'primevue/progressspinner'

defineProps({
  incidents: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})

const columns = [
  { key: 'address', header: "Address" },
  { key: 'narrative', header: "Incident" },
  { key: 'offense_date', header: "Offense Date", type: 'date' }
]
</script>

<template>
  <div class="incident-table">
    <div v-for="incident in incidents" :key="incident.id">
      <Fieldset :legend="incident.address">
        <DataTable class="bg-dark text-white" :value="incident.incidents" tableStyle="width: 100%; font-size: 0.8rem">
          <Column v-for="col of columns" :key="col.key" :header="col.header">
            <template #body="{ data }">
              <template v-if="col.type === 'date'">
                {{ dayjs(data[col.key]).format('(HH:mm) MM/DD/YYYY') }}
              </template>
              <template v-else>
                {{ data[col.key] }}
              </template>
            </template>
          </Column>
        </DataTable>
      </Fieldset>
    </div>
    <div v-if="isLoading" class="d-flex bg-white flex-column text-danger text-center justify-content-center">
      <ProgressSpinner />
        Loading Incidents...
      </div>
  </div>
 
  
</template>

<style scoped>
.incident-table {
  max-height: 40vh;
  overflow: auto;
}
</style>


