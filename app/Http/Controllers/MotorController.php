<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MotorController extends Controller
{
    public function updateMotor(Request $request)
    {
        // Get the array of motor commands from the request
        $motorCommands = $request->input('motorCommands');

        foreach ($motorCommands as $command) {
            $motorId = $command['motorId'];
            $speed = $command['speed'];
            $direction = $command['direction'];

            // Logic to update each motor based on request parameters
            // For example, you could use a MotorService to handle motor control

            // MotorService::updateMotor($motorId, $speed, $direction);
        }

        return response()->json(['status' => 'success']);
    }
}
