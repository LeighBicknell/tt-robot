import { defineStore } from 'pinia'

export const useShotsStore = defineStore('shots', {
    state: () => ({
        shots: [
            //{id: 1, name: 'topspin', topspin_min: 30, topspin_max:60, backspin_min: 0, backspin_max: 50}
        ] as Array<{
            id: number
            name: string
            topspin_min: number
            topspin_max: number
            backspin_min: number
            backspin_max: number
        }>
    }),
    actions: {
        async fetchShots() {
            try {
                const response = await fetch('/api/shots')
                if (!response.ok) throw new Error('Failed to fetch shots')
                this.shots = await response.json()
            } catch (error) {
                console.error('Error fetching shots:', error)
            }
        },

        async addShot(newShot: {
            name: string
            topspin_min: number
            topspin_max: number
            backspin_min: number
            backspin_max: number
        }) {
            try {
                const response = await fetch('/api/shots', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newShot),
                })
                if (!response.ok) throw new Error('Failed to store shot')
                const shot = await response.json()
                this.shots.push(shot)
            } catch (error) {
                console.error('Error storing shot:', error)
            }
        },

        async updateShot(id: number, updatedShot: {
            name?: string
            topspin_min?: number
            topspin_max?: number
            backspin_min?: number
            backspin_max?: number
        }) {
            try {
                const response = await fetch(`/api/shots/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedShot),
                })
                if (!response.ok) throw new Error('Failed to update shot')
                const shot = await response.json()
                const index = this.shots.findIndex(shot => shot.id === id)
                if (index !== -1) this.shots[index] = shot
            } catch (error) {
                console.error('Error updating shot:', error)
            }
        },

        async deleteShot(id: number) {
            try {
                const response = await fetch(`/api/shots/${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) throw new Error('Failed to delete shot')
                this.shots = this.shots.filter(shot => shot.id !== id)
            } catch (error) {
                console.error('Error deleting shot:', error)
            }
        },

        getShotsByIds(ids: number[]) {
          return this.shots.filter(shot => ids.includes(shot.id))
        }
    },
})
