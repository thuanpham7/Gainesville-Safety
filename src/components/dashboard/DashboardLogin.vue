<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios'
import { Loader } from '@googlemaps/js-api-loader'
import { useGeolocation } from '../../composables/useGeolocation'
import { useUserStore } from '../../stores/user'
import IncidentList from './incidents/IncidentList.vue'

import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const store = useUserStore()
const { removeCurrentUser } = store

const coords = useGeolocation().coords

const addressInput = ref(null)
const addressDestination = ref(null)
const destination = ref(null)
const directionsService = ref(null)
const directionsRender = ref(null)
const distance = ref(null)
const duration = ref(null)
const incidents = ref([])
const isLoading = ref(true)
const loadingIncident = ref(false)
const map = ref(null)
const mapDiv = ref(null)
const place = ref(null)

const loader = new Loader({ apiKey: import.meta.env.VITE_MAPS_API })

let autocomplete
let autocompleteDestination

const onPlaceChanged = async () => {
  place.value = await autocomplete.getPlace()
}

const onDestinationChanged = async () => {
  destination.value = await autocompleteDestination.getPlace()
}

const getMap = async () => {
  map.value = new google.maps.Map(mapDiv.value, {
    center: {
      lat: coords.value.latitude,
      lng: coords.value.longitude
    },
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  })

  new google.maps.Marker({
    position: {
      lat: coords.value.latitude,
      lng: coords.value.longitude
    },
    map: map.value
  })
  isLoading.value = false
}

const getIncident = async (addresses) => {
  addresses.forEach(async address => {
    const url = `select *, :id search '${address}' order by 'offense_date' desc limit 15`
    const res = await axios.get(`https://data.cityofgainesville.org/api/id/gvua-xt9q.json?$query=${url}`+ "&$$query_timeout_seconds=30")
    let i = 0
    incidents.value.push({
      id: i,
      address: address,
      incidents: res.data
    })
    i++
  })
  loadingIncident.value = false
}

const onCancel = () => {
  addressInput.value = null
  addressDestination.value = null
}

const getDirection = async () => {
  loadingIncident.value = true
  directionsService.value = new google.maps.DirectionsService()
  directionsRender.value = new google.maps.DirectionsRenderer()
  directionsRender.value.setMap(map.value)

  let streetSet = new Set()

  const direction = await directionsService.value.route({
    origin: place.value.formatted_address,
    destination: destination.value.formatted_address,
    travelMode: 'WALKING'
  })
  distance.value = direction.routes[0].legs[0].distance.text
  duration.value = direction.routes[0].legs[0].duration.text
  directionsRender.value.setDirections(direction)
  const res = direction.routes[0].legs[0].steps
  for (let i = 0; i < res.length; i++) {
    const addresses = await new google.maps.Geocoder().geocode({
      location: res[i].end_point
    })
    const address = addresses.results
    for (let j = 0; j < address.length; j++){
      if (address[j].address_components[1].long_name === "Gainesville" || address[j].address_components[1].long_name == "Alachua County")
        break
      let street = address[j].address_components[1].short_name

      if (streetSet.has(street) == false){
        streetSet.add(street)
      }
    }
  }
  getIncident(streetSet)
}

onMounted(async () => {
  await loader.importLibrary('places')
  await loader.importLibrary('routes')
  await loader.importLibrary('maps')
  await loader.importLibrary('geocoding')
  await loader.importLibrary('marker')

  autocomplete = new google.maps.places.Autocomplete(addressInput.value, {
    fields: ["formatted_address"]
  });
  autocompleteDestination = new google.maps.places.Autocomplete(addressDestination.value, {
    fields: ["formatted_address"]
  })
  autocomplete.addListener('place_changed', onPlaceChanged)
  autocompleteDestination.addListener('place_changed', onDestinationChanged)

})

watch(coords, (current, old) => {
  if (current.latitude?.toFixed(2) !== old.latitude?.toFixed(2) && current.longitude?.toFixed(2) !== old.longitude?.toFixed(2)) {
    getMap()
  }
})
</script>

<template>
  <div class="map-container"> 
    <div class="form-map m-4 p-4 bg-white border border-dark rounded">
      <form @submit.prevent="getDirection" @reset="onCancel">
        <div class="d-flex flex-column w-100">
          <input class="form-input rounded" ref="addressInput" placeholder="Origin" />
          <input class="form-input rounded" ref="addressDestination" placeholder="Destination" />
          <div class="d-flex" style="justify-content: space-between;"> 
            <Button class="form-input" type="submit" label="Get direction" size="small" />
            <Button class="form-input" type="reset" label="Reset" size="small" severity="secondary" />
          </div>
        </div>
      </form>
      <p v-if="distance" class="text-info text-center form-input"> Distance: {{ distance }} </p>
      <p v-if="duration" class="text-info text-center form-input"> Duration: {{ duration }} </p>
      <a @click="() => removeCurrentUser()"><div class="mt-3 text-danger text-center">Logout</div></a>
    </div>
    <div ref="mapDiv" class="map" />
  </div>
  <div v-if="isLoading" class="d-flex flex-column text-danger text-center justify-content-center">
    <ProgressSpinner />
    Loading Maps...
  </div>
  <incident-list :incidents="incidents" :isLoading="loadingIncident" class="incident"  />
</template>

<style scoped>
.map-container {
  position: relative;
  display: flex;
  justify-content: center;
}
.form-map {
  z-index: 1;
}
.form-input {
  margin: 5px;
}
.map {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
}
.incident {
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
}
.p-button {
  padding: 0.4rem;
}
a {
  cursor: pointer;
  text-decoration: underline;
}
</style>