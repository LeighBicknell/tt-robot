<?php
namespace App\Services;


class MotorService implements MotorServiceInterface {
    const MotorMap = [
        'rotation' => 1,
        'feeder' => 2,
        'topspin' => 3,
        'backspin' => 4
    ];

    public function updateMotor($motorNumber, $speed)
    {
        // Define the path to the Python script
        $scriptPath = base_path('resources/python/motor_control.py');

        // Ensure the motor number and speed are integers
        $motorNumber = intval($motorNumber);
        $speed = intval($speed);

        // Command to execute the Python script
        $command = escapeshellcmd("python3 $scriptPath $motorNumber $speed");

        // Execute the command and capture the output
        $output = shell_exec($command);

        // Optionally handle the output or errors
        if ($output === null) {
            throw new \Exception("Failed to execute Python script");
        }

        return $output;
    }
}
