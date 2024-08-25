import sys
import time
from adafruit_motorkit import MotorKit
import board
import busio

class MotorController:
    def __init__(self, pulse_map=None, pulse_duration=0.3):
        self.kit = MotorKit(i2c=busio.I2C(board.SCL, board.SDA))
        self.motors = [self.kit.motor1, self.kit.motor2, self.kit.motor3, self.kit.motor4]
        self.pulse_map = pulse_map if pulse_map is not None else self.default_pulse_map()
        self.pulse_duration = pulse_duration

    def default_pulse_map(self):
        return {
            'speed_up': [
                (0.1, 0.2, 0.15),
                (0.2, 0.22, 0.27),
                (0.22, 0.24, 0.3),
                (0.24, 0.27, 0.35),
                (0.27, 0.30, 0.4),
                (0.30, 0.33, 0.46),
                (0.33, 0.35, 0.48),
                (0.35, 0.41, 0.5),
                (0.41, 0.45, 0.48),
                (0.43, 0.50, 0.45),
                (0.50, 1, 0.40),
                # Add more ranges as needed
            ]
        }

    def find_nearest_pulse(self, throttle_difference):
        for lower, upper, pulse in self.pulse_map['speed_up']:
            if lower <= abs(throttle_difference) < upper:
                return pulse
        return 0  # Default pulse if no range matches

    def set_motor_speeds(self, motor_speeds):
        # Step 1: Update motor 1 if it's specified
        if 1 in motor_speeds:
            self.update_motor(1, motor_speeds[1])

        # Step 2: Stop motor 2 if motors 3 or 4 are updating with a non-zero value
        if 2 in motor_speeds and any(motor_number in [3, 4] and motor_speeds[motor_number] != 0 for motor_number in motor_speeds):
            self.motors[1].throttle = 0
            print("Motor 2 (feeder) stopped")

        # Step 3: Handle motors 3 and 4
        if (3 in motor_speeds and motor_speeds[3] != 0) or (4 in motor_speeds and motor_speeds[4] != 0):
            # 3.a: Stop motors 3 and 4
            if 3 in motor_speeds:
                self.motors[2].throttle = 0
            if 4 in motor_speeds:
                self.motors[3].throttle = 0
            print("Motors 3 and/or 4 stopped")
            time.sleep(0.2)  # Delay after stopping

            # 3.b: Calculate and apply pulse for motors 3 and 4
            if 3 in motor_speeds:
                self.update_motor(3, motor_speeds[3], use_pulse=True)
            if 4 in motor_speeds:
                self.update_motor(4, motor_speeds[4], use_pulse=True)

            # 3.c: Short delay for the pulse
            time.sleep(self.pulse_duration)

            # 3.d: Set final speeds for motors 3 and 4
            if 3 in motor_speeds:
                self.update_motor(3, motor_speeds[3])
            if 4 in motor_speeds:
                self.update_motor(4, motor_speeds[4])

        # Step 4: Update motor 2 if it's specified
        if 2 in motor_speeds:
            self.update_motor(2, motor_speeds[2])

    def update_motor(self, motor_number, new_speed, use_pulse=False):
        if motor_number < 1 or motor_number > 4:
            raise ValueError("Motor number must be between 1 and 4.")

        # Normalize the new speed to a value between -1.0 and 1.0
        normalized_speed = new_speed / 100.0

        # Calculate the throttle difference
        throttle_difference = normalized_speed

        # Use the pulse map to find an appropriate pulse
        pulse_factor = self.find_nearest_pulse(throttle_difference)

        # Invert pulse for negative throttles
        if throttle_difference < 0:
            pulse_factor = -pulse_factor

        # Apply the pulse throttle if specified
        if use_pulse and normalized_speed != 0:
            pulse_throttle = normalized_speed + pulse_factor
            pulse_throttle = max(min(pulse_throttle, 1.0), -1.0)
            self.motors[motor_number - 1].throttle = pulse_throttle
            print(f"Motor {motor_number} pulse throttle: {pulse_throttle * 100:.2f} diff: {throttle_difference} pulse factor: {pulse_factor}")

        # Set the motor to the desired speed
        self.motors[motor_number - 1].throttle = normalized_speed
        print(f"Motor {motor_number} final throttle: {normalized_speed * 100:.2f}")

if __name__ == "__main__":
    if len(sys.argv) < 3 or len(sys.argv) % 2 != 1:
        print("Usage: python motor_control.py <motor_number1> <speed1> [<motor_number2> <speed2> ...]")
        sys.exit(1)

    # Parse motor numbers and speeds from command line arguments
    args = sys.argv[1:]
    motor_speeds = {int(args[i]): int(args[i+1]) for i in range(0, len(args), 2)}

    controller = MotorController()
    controller.set_motor_speeds(motor_speeds)
