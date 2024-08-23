import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useShotStatusStore = defineStore('shotStatus', {
  state: () => ({
    activeShotId: null as number | null,
    enabledShotIds: [] as number[],
  }),

  getters: {
    isEnabled: (state) => (id: number) => state.enabledShotIds.includes(id),
  },

  actions: {
    setActiveShot(id: number | null) {
      this.activeShotId = id
    },

    enableShot(id: number) {
      if (!this.enabledShotIds.includes(id)) {
        this.enabledShotIds.push(id)
      }
    },

    disableShot(id: number) {
      this.enabledShotIds = this.enabledShotIds.filter(shotId => shotId !== id)
    },

    toggleShotEnabled(id: number) {
      if (this.isEnabled(id)) {
        this.disableShot(id)
      } else {
        this.enableShot(id)
      }
    },

    selectRandomEnabledShot() {
      if (this.enabledShotIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.enabledShotIds.length)
        this.setActiveShot(this.enabledShotIds[randomIndex])
      }
    },

    removeShot(shotId: number) {
      this.enabledShots.delete(shotId) // Remove from enabled shots
      if (this.activeShotId === shotId) {
        this.activeShotId = null // Clear active shot if it's being deleted
      }
    },
  }
})

// Setup event listeners when store is created
const { $eventBus } = useNuxtApp()
$eventBus.on('shotDeleted', (id: number) => {
  const store = useShotStatusStore()
  store.removeShot(id)
})
