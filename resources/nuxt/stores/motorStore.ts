import { defineStore } from 'pinia'

export const useMotorStore = defineStore('motor', {
    state: () => ({
        // State now uses arrays to represent min and max speeds
        motors: {
            rotation: [0, 0],
            feeder: [20, 30],
            topspin: [30, 50],
            backspin: [30, 50],
        }
    }),
    actions: {
        async updateMotorSpeeds() {
            // Generate random speeds for each motor
            const motorUpdates = Object.entries(this.motors).map(([motorName, [minSpeed, maxSpeed]]) => {
                const speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                return { motorName, speed };
            });

            // Send the motor updates to the server
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motorUpdates),
            });
        },
        async stopMotors() {
            // Prepare a payload to set all motors to 0
            const stopCommand = Object.keys(this.motors).map(motorName => ({ motorName, speed: 0 }));

            // Send the stop command to the server
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stopCommand),
            });
        },
        async stallMotors() {
            // Prepare a payload to set all motors to null
            const stallCommand = Object.keys(this.motors).map(motorName => ({ motorName, speed: null }));

            // Send the stall command to the server
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stallCommand),
            });
        }
    },
    getters: {
        getMotorState: (state) => (motorName: string) => {
            // Return default array if motorName not found
            return state.motors[motorName] || [-100, 100]
        }
    }
})
