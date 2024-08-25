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
        # Example mapping, customize based on actual testing
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
        # Find the nearest pulse value based on throttle_difference
        for lower, upper, pulse in self.pulse_map['speed_up']:
            if lower <= abs(throttle_difference) < upper:
                return pulse
        return 0  # Default pulse if no range matches

    def set_motor_speed(self, motor_number, new_speed):
        if motor_number < 1 or motor_number > 4:
            raise ValueError("Motor number must be between 1 and 4.")

        # Normalize the new speed to a value between -1.0 and 1.0
        normalized_speed = new_speed / 100.0

        # Always set the current throttle to 0 before making adjustments
        if motor_number > 2:
            #if normalized_speed != 0:
            #    # If we're spinning up a thrower stop the feeder for a moment
            #    self.motors[1].throttle = 0
            self.motors[motor_number - 1].throttle = 0
            time.sleep(0.2)  # Wait a bit to ensure motor has stopped

        # Since current throttle is always 0, the difference is just the normalized speed
        throttle_difference = normalized_speed

        # Use the pulse map to find an appropriate pulse
        pulse_factor = self.find_nearest_pulse(throttle_difference)

        # Invert pulse for negative throttles
        if throttle_difference < 0:
            pulse_factor = -pulse_factor

        # Apply the pulse throttle
        pulse_throttle = normalized_speed + pulse_factor
        pulse_throttle = max(min(pulse_throttle, 1.0), -1.0)
        if motor_number > 2:
            self.motors[motor_number - 1].throttle = pulse_throttle
            print(f"Motor {motor_number} pulse throttle: {self.motors[motor_number - 1].throttle * 100:.2f} diff: {throttle_difference} pulse factor: {pulse_factor}")

            # Short delay for the pulse
            time.sleep(self.pulse_duration)

        # Set the motor to the desired speed
        self.motors[motor_number - 1].throttle = normalized_speed


        #if motor_number > 2:
        #    if normalized_speed != 0:
        #        # If we're spinning up a thrower stop the feeder for a moment
        #        time.sleep(2)
        #        self.motors[1].throttle = 0.35
        print(f"Motor {motor_number} final throttle: {self.motors[motor_number - 1].throttle * 100:.2f}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python motor_control.py <motor_number> <speed>")
        sys.exit(1)

    motor_number = int(sys.argv[1])
    new_speed = int(sys.argv[2])

    controller = MotorController()
    controller.set_motor_speed(motor_number, new_speed)
    #time.sleep(0.8)
    #if new_speed != 0:
    #    controller.set_motor_speed(2, 90)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 0)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 90)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 0)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 90)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 0)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 90)
    #    time.sleep(0.43)
    #    controller.set_motor_speed(2, 0)
    #    time.sleep(0.43)
