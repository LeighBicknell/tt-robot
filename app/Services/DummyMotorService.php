<?php

namespace App\Services;

class DummyMotorService extends MotorService implements MotorServiceInterface
{
    public function updateMotor($motorId, $speed)
    {
        // Do nothing
    }
}
