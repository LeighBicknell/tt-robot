<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MotorServiceInterface;

class MotorController extends Controller
{
    protected $motorService;

    public function __construct(MotorServiceInterface $motorService)
    {
        $this->motorService = $motorService;
    }

    public function updateMotor(Request $request)
    {
        // Extract motor commands from the request
        $motorCommands = $request->input();

        // Validate that we have received an array of commands
        if (!is_array($motorCommands)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid input format.'], 400);
        }

        // Prepare an associative array to send to the MotorService
        $motorSpeeds = [];

        foreach ($motorCommands as $command) {
            if (!isset($command['motorName']) || !isset($command['speed'])) {
                return response()->json(['status' => 'error', 'message' => 'Invalid command format.'], 400);
            }

            $motorName = $command['motorName'];
            $speed = $command['speed'];

            // Validate motor name and speed
            if (!array_key_exists($motorName, \App\Services\MotorService::MotorMap)) {
                return response()->json(['status' => 'error', 'message' => "Invalid motor name: $motorName"], 400);
            }

            if (!is_numeric($speed) || $speed < -100 || $speed > 100) {
                return response()->json(['status' => 'error', 'message' => "Invalid speed value for $motorName: $speed"], 400);
            }

            // Add to the motor speeds array
            $motorSpeeds[$motorName] = $speed;
        }

        // Use the MotorService to update the motors in one go
        try {
            $output = $this->motorService->updateMotor($motorSpeeds);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }

        // Return a successful response
        return response()->json(['status' => 'success', 'output' => $output]);
    }
}
