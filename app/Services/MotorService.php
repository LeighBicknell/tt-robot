<?php
namespace App\Services;

class MotorService implements MotorServiceInterface {
    const MotorMap = [
        'rotation' => 1,
        'feeder' => 2,
        'topspin' => 3,
        'backspin' => 4
    ];

    public function updateMotor($motorSpeeds)
    {
        // Define the path to the Python script
        $scriptPath = base_path('resources/python/motor_control.py');

        // Fetch the Python executable path from the config
        $python = config('app.python');

        // Initialize the command with the path to the Python executable and script
        $command = "$python $scriptPath";

        // Append motor number and speed pairs to the command
        foreach ($motorSpeeds as $motorName => $speed) {
            // Ensure the motor name exists in the MotorMap
            if (!array_key_exists($motorName, self::MotorMap)) {
                throw new \InvalidArgumentException("Invalid motor name: $motorName");
            }

            // Get the motor number from the map
            $motorNumber = self::MotorMap[$motorName];

            // Append motor number and speed to the command
            $command .= " $motorNumber $speed";
        }

        // Execute the command and capture the output
        $output = shell_exec($command);

        // Optionally handle the output or errors
        if ($output === null) {
            throw new \Exception("Failed to execute Python script: $command");
        }

        return $output;
    }
}
