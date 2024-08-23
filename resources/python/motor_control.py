import sys
from adafruit_motorkit import MotorKit
import board
import busio

class MotorController:
    def __init__(self):
        self.kit = MotorKit(i2c=busio.I2C(board.SCL, board.SDA))

    def set_motor_speed(self, motor_number, speed):
        """
        Set the speed of the specified motor.

        :param motor_number: The motor number (1 to 4).
        :param speed: The speed of the motor (-255 to 255).
        """
        if motor_number < 1 or motor_number > 4:
            raise ValueError("Motor number must be between 1 and 4.")

        # Adjust the speed value to be between -1.0 and 1.0
        normalized_speed = speed / 100.0

        # Assuming each motor is mapped to a specific MotorKit motor
        if motor_number == 1:
            self.kit.motor1.throttle = normalized_speed
        elif motor_number == 2:
            self.kit.motor2.throttle = normalized_speed
        elif motor_number == 3:
            self.kit.motor3.throttle = normalized_speed
        elif motor_number == 4:
            self.kit.motor4.throttle = normalized_speed

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python motor_control.py <motor_number> <speed>")
        sys.exit(1)

    motor_number = int(sys.argv[1])
    speed = int(sys.argv[2])

    controller = MotorController()
    controller.set_motor_speed(motor_number, speed)
