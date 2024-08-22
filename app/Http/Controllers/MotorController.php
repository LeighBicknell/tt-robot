<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MotorService;

class MotorController extends Controller
{
    public function updateMotor(Request $request)
    {
        // Get the array of motor commands from the request
        $motorCommands = $request->input();

        foreach ($motorCommands as $command) {
            $motorName = $command['motorName'];
            $motorId = MotorService::MotorMap[$motorName];
            $speed = $command['speed'];

            // Logic to update each motor based on request parameters
            // For example, you could use a MotorService to handle motor control

            // MotorService::updateMotor($motorId, $speed, $direction);
        }

        return response()->json(['status' => 'success']);
    }
}
