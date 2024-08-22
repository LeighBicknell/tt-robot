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

const shotsStore = useShotsStore()
const motorStore = useMotorStore()

const selectedShotId = ref<number | null>(null)

// Handle item selection
const handleSelection = (shotId: number) => {
    selectedShotId.value = shotId
}

// Handle shot deletion
const deleteShot = (shotId: number) => {
    shotsStore.deleteShot(shotId)
}

// Handle shot save
const saveShot = (shotId: number) => {
    const selectedShot = shotsStore.shots.find(shot => shot.id === shotId)
    if (selectedShot) {
        // Prepare the updated shot data
        const updatedShot = {
            topspin_min: motorStore.motors.topspin[0],
            topspin_max: motorStore.motors.topspin[1],
            backspin_min: motorStore.motors.backspin[0],
            backspin_max: motorStore.motors.backspin[1],
        }
        // Call updateShot method from shotsStore
        shotsStore.updateShot(shotId, updatedShot)
    }
}

// Watcher for changes in selectedShotId
watch(selectedShotId, (newId) => {
    const selectedShot = shotsStore.shots.find(shot => shot.id === newId)
    if (selectedShot) {
        motorStore.motors.topspin = [selectedShot.topspin_min, selectedShot.topspin_max]
        motorStore.motors.backspin = [selectedShot.backspin_min, selectedShot.backspin_max]
    }
})

onMounted(() => {
    shotsStore.fetchShots()
})
</script>

<style scoped>
/* Add any additional styling here */
.v-list-item--active {
    background-color: #e0e0e0; /* Customize active item style */
}
</style>
