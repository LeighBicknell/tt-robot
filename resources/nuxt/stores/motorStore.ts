import { defineStore } from 'pinia';

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
            // Helper function to introduce a delay
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            // Step 1: Stop the feeder motor
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ motorName: 'feeder', speed: 0 }]),
            });

            // Step 2: Update the speeds for other motors
            const motorUpdates = Object.entries(this.motors)
                .filter(([motorName]) => motorName !== 'feeder') // Exclude feeder for now
                .map(([motorName, [minSpeed, maxSpeed]]) => {
                    const speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                    return { motorName, speed };
                });

            // Send updates for the other motors
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motorUpdates),
            });

            // Step 3: Introduce a delay before updating the feeder motor
            await delay(1000); // Adjust as needed.

            // Step 4: Update the feeder motor after delay
            const [feederMinSpeed, feederMaxSpeed] = this.motors.feeder;
            const feederSpeed = Math.floor(Math.random() * (feederMaxSpeed - feederMinSpeed + 1)) + feederMinSpeed;

            // Send the update for the feeder motor
            await fetch('/api/motor/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ motorName: 'feeder', speed: feederSpeed }]),
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
            return state.motors[motorName] || [-100, 100];
        }
    }
});
