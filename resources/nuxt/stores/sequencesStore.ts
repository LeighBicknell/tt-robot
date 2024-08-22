import { defineStore } from 'pinia'
import { useShotsStore } from '~/stores/shotsStore'

export const useSequencesStore = defineStore('sequences', {
  state: () => ({
    sequences: [{
        id: 1,
        name: "hardcoded",
        description: "hardcoded sequence",
        shot_ids: [1,3]
    }] as Array<{
      id: number
      name: string
      description?: string
      shot_ids: number[] // Array of shot IDs
    }>
  }),
  actions: {
    async fetchSequences() {
      try {
        const response = await fetch('/api/sequences')
        if (!response.ok) throw new Error('Failed to fetch sequences')
        this.sequences = await response.json()
      } catch (error) {
        console.error(error)
      }
    },
    async addSequence(name: string, description?: string) {
      try {
        const response = await fetch('/api/sequences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, description })
        })
        if (!response.ok) throw new Error('Failed to add sequence')
        const newSequence = await response.json()
        this.sequences.push(newSequence)
      } catch (error) {
        console.error(error)
      }
    },
    async updateSequence(id: number, name: string, description?: string) {
      try {
        const response = await fetch(`/api/sequences/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, description })
        })
        if (!response.ok) throw new Error('Failed to update sequence')
        const updatedSequence = await response.json()
        const index = this.sequences.findIndex(seq => seq.id === id)
        if (index !== -1) {
          this.sequences[index] = updatedSequence
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deleteSequence(id: number) {
      try {
        const response = await fetch(`/api/sequences/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete sequence')
        this.sequences = this.sequences.filter(seq => seq.id !== id)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchShots(sequenceId: number) {
      const shotsStore = useShotsStore()
      try {
        const response = await fetch(`/api/sequences/${sequenceId}/shots`)
        if (!response.ok) throw new Error('Failed to fetch shots')
        const shotIds = await response.json()
        // Use shotsStore to fetch and manage shots
        await shotsStore.fetchShots() // Ensure shotsStore is populated
        return shotIds.map(id => shotsStore.shots.find(shot => shot.id === id))
      } catch (error) {
        console.error(error)
        return []
      }
    }
  }
})
