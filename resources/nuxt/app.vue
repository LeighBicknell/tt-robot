<template>
  <v-container fluid class="pa-4">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Shot List Component -->
        <v-card class="shot-list-container">
            <v-card-title>Shots</v-card-title>
          <ShotList />

          <v-btn
            @click="createNewShot"
            color="success"
            class="ma-2"
          >
            New Shot
          </v-btn>
        </v-card>

        <!-- Sequence List Component -->
        <v-card class="sequence-list-container">
            <v-card-title>Sequences</v-card-title>
          <SequenceList />

          <v-btn
            @click="createNewSequence"
            color="success"
            class="ma-2"
          >
            New Sequence
          </v-btn>
        </v-card>

        <!-- Slider Container -->
        <v-card class="slider-container">
            <v-card-title>Motors</v-card-title>
          <!-- Loop through the motors in the store to generate sliders dynamically -->
          <MotorSlider
            v-for="(motor, motorName) in motorStore.motors"
            :key="motorName"
            :motorName="motorName"
            v-model="motorStore.motors[motorName]"
          />
        </v-card>

        <!-- Buttons for controlling motors -->
        <v-card class="control-buttons">
          <v-btn
            @click="startUpdateTimer"
            :disabled="isStarted"
            color="primary"
            class="ma-2"
          >
            Start
          </v-btn>

          <v-btn
            @click="stopAndStopMotors"
            :disabled="!isStarted"
            color="secondary"
            class="ma-2"
          >
            Stop
          </v-btn>

          <v-btn
            @click="stopAndStallMotors"
            :disabled="!isStarted"
            color="error"
            class="ma-2"
          >
            Stall
          </v-btn>


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { useMotorStore } from '~/stores/motorStore'
import { useShotsStore } from '~/stores/shotsStore'
import MotorSlider from '~/components/MotorSlider.vue'
import SequenceList from '~/components/SequenceList.vue'
import { ref, onMounted, onUnmounted } from 'vue'

// Initialize Pinia store
const motorStore = useMotorStore()
const shotsStore = useShotsStore()

// Timer reference
const timer = ref<NodeJS.Timeout | null>(null)

// State to track if the motors are started
const isStarted = ref(false)

// Function to update motor speeds
const updateMotorSpeeds = () => {
  console.log('Updating motor speeds');
  motorStore.updateMotorSpeeds().catch(error => console.error('Failed to update motor speeds:', error));
}

// Start the update timer
const startUpdateTimer = () => {
  if (!timer.value) {
    timer.value = setInterval(updateMotorSpeeds, 2000); // 2000 ms = 2 seconds
    isStarted.value = true; // Set motors as started
  }
}

// Stop the update timer and call stopMotors action
const stopAndStopMotors = async () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
    isStarted.value = false; // Set motors as stopped
  }
  try {
    await motorStore.stopMotors();
    console.log('All motors stopped.');
  } catch (error) {
    console.error('Failed to stop motors:', error);
  }
}

// Stop the update timer and call stallMotors action
const stopAndStallMotors = async () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
    isStarted.value = false; // Set motors as stopped
  }
  try {
    await motorStore.stallMotors();
    console.log('All motors stalled.');
  } catch (error) {
    console.error('Failed to stall motors:', error);
  }
}

const createNewShot = async () => {
  const name = prompt('Enter name for the new shot:')
  if (name) {
    const [topspinMin, topspinMax] = motorStore.motors.topspin
    const [backspinMin, backspinMax] = motorStore.motors.backspin
    try {
      await useShotsStore().addShot({
        name,
        topspin_min: topspinMin,
        topspin_max: topspinMax,
        backspin_min: backspinMin,
        backspin_max: backspinMax,
      })
    } catch (error) {
      console.error('Failed to add shot:', error)
    }
  }
}

const createNewSequence = async () => {
  const name = prompt('Enter name for the new shot:')
  if (name) {
    const [topspinMin, topspinMax] = motorStore.motors.topspin
    const [backspinMin, backspinMax] = motorStore.motors.backspin
    try {
      await useShotsStore().addShot({
        name,
        topspin_min: topspinMin,
        topspin_max: topspinMax,
        backspin_min: backspinMin,
        backspin_max: backspinMax,
      })
    } catch (error) {
      console.error('Failed to add shot:', error)
    }
  }
}

// Clean up timer on component unmount
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
})
</script>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  margin-top:20px;
}

.control-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
