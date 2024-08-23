<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MotorServiceInterface;
use App\Services\MotorService;

class MotorController extends Controller
{
    protected $motorService;

    public function __construct(MotorServiceInterface $motorService)
    {
        $this->motorService = $motorService;
    }

    public function updateMotor(Request $request)
    {
        $motorCommands = $request->input();

        foreach ($motorCommands as $command) {
            $motorName = $command['motorName'];
            $motorId = MotorService::MotorMap[$motorName];
            $speed = $command['speed'];

            // Use the injected MotorService implementation
            $this->motorService->updateMotor($motorId, $speed);
        }

        return response()->json(['status' => 'success']);
    }
}
