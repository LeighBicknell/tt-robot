<template>
  <div>
    <!-- Slider for Rotation -->
    <v-range-slider
      v-model="rotationRange"
      :max="100"
      :min="-100"
      :range="true"
      label="Rotation"
      @input="handleRangeChange('rotation')"
    ></v-range-slider>

    <!-- Slider for Feeder -->
    <v-range-slider
      v-model="feederRange"
      :max="100"
      :min="-100"
      :range="true"
      label="Feeder"
      @input="handleRangeChange('feeder')"
    ></v-range-slider>

    <!-- Slider for Topspin -->
    <v-range-slider
      v-model="topspinRange"
      :max="100"
      :min="-100"
      :range="true"
      label="Topspin"
      @input="handleRangeChange('topspin')"
    ></v-range-slider>

    <!-- Slider for Backspin -->
    <v-range-slider
      v-model="backspinRange"
      :max="100"
      :min="-100"
      :range="true"
      label="Backspin"
      @input="handleRangeChange('backspin')"
    ></v-range-slider>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMotorStore } from '~/stores/motorStore'

// Initialize Pinia store
const motorStore = useMotorStore()

// Define reactive ranges for each motor
const rotationRange = ref([motorStore.getMotorState('rotation').minSpeed, motorStore.getMotorState('rotation').maxSpeed])
const feederRange = ref([motorStore.getMotorState('feeder').minSpeed, motorStore.getMotorState('feeder').maxSpeed])
const topspinRange = ref([motorStore.getMotorState('topspin').minSpeed, motorStore.getMotorState('topspin').maxSpeed])
const backspinRange = ref([motorStore.getMotorState('backspin').minSpeed, motorStore.getMotorState('backspin').maxSpeed])

// Watchers to trigger updates when the slider ranges change
watch(rotationRange, () => handleRangeChange('rotation'))
watch(feederRange, () => handleRangeChange('feeder'))
watch(topspinRange, () => handleRangeChange('topspin'))
watch(backspinRange, () => handleRangeChange('backspin'))

// Function to generate a random speed within a specified range
function getRandomSpeed(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Handle range slider changes and update motor speed
function handleRangeChange(motorName) {
  const ranges = {
    rotation: rotationRange.value,
    feeder: feederRange.value,
    topspin: topspinRange.value,
    backspin: backspinRange.value
  }
  const [minSpeed, maxSpeed] = ranges[motorName]
  const randomSpeed = getRandomSpeed(minSpeed, maxSpeed)
  motorStore.updateMotorSpeed(motorName, randomSpeed)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
