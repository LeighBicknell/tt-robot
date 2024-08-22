import { defineStore } from 'pinia'

export const useMotorStore = defineStore('motor', {
  state: () => ({
    motors: {
      rotation: { minSpeed: -100, maxSpeed: 100 },
      feeder: { minSpeed: -100, maxSpeed: 100 },
      topspin: { minSpeed: -100, maxSpeed: 100 },
      backspin: { minSpeed: -100, maxSpeed: 100 },
    }
  }),
  actions: {
    async updateMotorSpeed(motorName: string, speed: number) {
      // API call to update motor speed
      await fetch('/motor/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motorName, speed }),
      })
    },
    async updateMotorSpeeds(motorUpdates: { [key: string]: number }) {
      await fetch('/motor/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motors: motorUpdates }),
      })
    }
  },
  getters: {
    getMotorState: (state) => (motorName: string) => {
      return state.motors[motorName] || { minSpeed: -100, maxSpeed: 100 }
    }
  }
})
