<template>
  <div v-if="shotsStore.loading">Loading shots...</div>
  <v-list v-else>
    <v-list-item
      v-for="shot in shotsStore.shots"
      :key="shot.id"
      :value="shot.id"
      @click="handleSelection(shot.id)"
      :class="{ 'v-list-item--active': shot.id === selectedShotId }"
    >
      <v-list-item-title>{{ shot.name }}</v-list-item-title>
      <v-list-item-subtitle>
        Topspin: {{ shot.topspin_min }} - {{ shot.topspin_max }} |
        Backspin: {{ shot.backspin_min }} - {{ shot.backspin_max }}
      </v-list-item-subtitle>
      <template v-slot:prepend>
        <!-- Checkbox to enable/disable shot -->
        <v-checkbox
          v-model="enabledShots[shot.id]"
          @click.stop="toggleShotEnabled(shot.id)"
        ></v-checkbox>
      </template>
      <template v-slot:append>
        <v-list-item-action start>
          <v-btn @click.stop="saveShot(shot.id)" icon>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn @click.stop="deleteShot(shot.id)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useShotsStore } from '~/stores/shotsStore'
import { useMotorStore } from '~/stores/motorStore'
import { useShotStatusStore } from '~/stores/shotStatusStore'

const shotsStore = useShotsStore()
const motorStore = useMotorStore()
const shotStatusStore = useShotStatusStore()

const selectedShotId = computed(() => shotStatusStore.activeShotId)

// Get a mapping of shot IDs to their enabled status
const enabledShots = computed(() => {
  return shotsStore.shots.reduce((acc, shot) => {
    acc[shot.id] = shotStatusStore.isEnabled(shot.id)
    return acc
  }, {} as Record<number, boolean>)
})

// Handle item selection
const handleSelection = (shotId: number) => {
  selectedShotId.value = shotId
  shotStatusStore.setActiveShot(shotId) // Update the active shot in the store
}

// Handle shot deletion
const deleteShot = async (shotId: number) => {
  await shotsStore.deleteShot(shotId)
  //shotStatusStore.removeShot(shotId) // Remove shot from the status store
}

// Handle shot save
const saveShot = async (shotId: number) => {
  const selectedShot = shotsStore.shots.find(shot => shot.id === shotId)
  if (selectedShot) {
    // Prepare the updated shot data without the client-only 'enabled' field
    const updatedShot = {
      topspin_min: motorStore.motors.topspin[0],
      topspin_max: motorStore.motors.topspin[1],
      backspin_min: motorStore.motors.backspin[0],
      backspin_max: motorStore.motors.backspin[1],
    }
    // Call updateShot method from shotsStore
    await shotsStore.updateShot(shotId, updatedShot)
  }
}

// Watch for changes in activeShotId and update motorStore
watch(() => shotStatusStore.activeShotId, (newId) => {
  if (newId !== null) {
    const selectedShot = shotsStore.shots.find(shot => shot.id === newId)
    if (selectedShot) {
      motorStore.motors.topspin = [selectedShot.topspin_min, selectedShot.topspin_max]
      motorStore.motors.backspin = [selectedShot.backspin_min, selectedShot.backspin_max]
    }
  }
}, { immediate: true })

// Toggle shot enabled state
const toggleShotEnabled = (shotId: number) => {
  shotStatusStore.toggleShotEnabled(shotId)
}

onMounted(async () => {
  await shotsStore.fetchShots()
})
</script>

<style scoped>
/* Add any additional styling here */
.v-list-item--active {
  background-color: #e0e0e0; /* Customize active item style */
}
</style>
