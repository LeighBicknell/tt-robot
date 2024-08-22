<template>
  <v-container>
    <!-- Loading Indicator -->
    <v-list v-if="sequencesStore.loading">Loading sequences...</v-list>

    <!-- Sequences List -->
    <v-list v-else>
      <v-list-item-group v-if="sequencesStore.sequences.length" v-for="sequence in sequencesStore.sequences" :key="sequence.id">
        <v-list-item @click="toggleShots(sequence.id)" class="sequence-item">
          <v-list-item-content>
            <v-list-item-title>{{ sequence.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ sequence.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>{{ isExpanded(sequence.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-list-item-action>
        </v-list-item>

        <!-- Nested list for shots -->
        <v-expand-transition>
          <v-list v-if="isExpanded(sequence.id)" class="shots-list">
            <v-list-item-group v-for="shot in orderedShots(sequence.shot_ids)" :key="shot.id">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ shot.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Topspin: {{ shot.topspin_min }} - {{ shot.topspin_max }} |
                    Backspin: {{ shot.backspin_min }} - {{ shot.backspin_max }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expand-transition>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSequencesStore } from '~/stores/sequencesStore'
import { useShotsStore } from '~/stores/shotsStore'

// Initialize stores
const sequencesStore = useSequencesStore()
const shotsStore = useShotsStore()
const expandedSequences = ref<Set<number>>(new Set())

// Toggle sequence shots visibility
const toggleShots = (sequenceId: number) => {
  if (expandedSequences.value.has(sequenceId)) {
    expandedSequences.value.delete(sequenceId)
  } else {
    expandedSequences.value.add(sequenceId)
  }
}

// Check if a sequence is expanded
const isExpanded = (sequenceId: number) => expandedSequences.value.has(sequenceId)

// Get shots based on their IDs and order them according to the sequence
const orderedShots = (shotIds: number[]) => {
  if (!Array.isArray(shotIds)) {
    console.error('shotIds is not an array:', shotIds)
    return []
  }

  // Debugging output
  console.log('Fetching shots for IDs:', shotIds)

  return shotsStore.getShotsByIds(shotIds).sort((a, b) => {
    return shotIds.indexOf(a.id) - shotIds.indexOf(b.id)
  })
}

onMounted(async () => {
  //await sequencesStore.fetchSequences()
  await shotsStore.fetchShots()
  console.log('Sequences mounted')
  console.log(sequencesStore.sequences)
})
</script>

<style scoped>
/* Add any additional styling here */
.v-list-item--active {
  background-color: #e0e0e0; /* Customize active item style */
}
</style>
