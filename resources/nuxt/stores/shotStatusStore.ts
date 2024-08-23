import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { inject } from 'vue'

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
      // Remove from enabled shots
      const index = this.enabledShotIds.indexOf(shotId)
      if (index !== -1) {
        this.enabledShotIds.splice(index, 1)
      }
      // Clear active shot if it's being deleted
      if (this.activeShotId === shotId) {
        this.activeShotId = null;
      }
    },

    setupEventListeners() {
        // Setup event listeners when store is created
        const { $bus } = useNuxtApp()
        $bus.$on('shotDeleted', (id: number) => {
          console.log('received delete event')
          const store = useShotStatusStore()
          store.removeShot(id)
            console.log('Removed shot ' + id + ' from shotstatus store due to event')
        })
    },

  }
})

