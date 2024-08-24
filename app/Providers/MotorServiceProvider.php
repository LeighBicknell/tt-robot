<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\MotorServiceInterface;
use App\Services\DummyMotorService;
use App\Services\MotorService;

class MotorServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(MotorServiceInterface::class, function ($app) {
            $serviceType = env('MOTOR_SERVICE_TYPE', 'dummy');

            switch ($serviceType) {
                case 'real':
                    return new MotorService();
                case 'dummy':
                default:
                    return new DummyMotorService();
            }
        });
    }
}
