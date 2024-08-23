<template>
  <v-range-slider
    :max="100"
    :min="-100"
    :range="true"
    :label="formattedLabel"
    thumb-label="always"
    step="5"
    strict
  ></v-range-slider>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'

// Define props with TypeScript for better type safety
const props = defineProps<{
  motorName: string
}>()

// Computed property to format the label
const formattedLabel = computed(() => {
  return props.motorName ? props.motorName.charAt(0).toUpperCase() + props.motorName.slice(1) : 'Unknown Motor'
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
