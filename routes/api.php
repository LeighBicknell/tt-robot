<?php
use App\Http\Controllers\ShotController;
use App\Http\Controllers\SequenceController;
use App\Http\Controllers\MotorController;
use Illuminate\Support\Facades\Route;

Route::apiResource('shots', ShotController::class);
Route::apiResource('sequences', SequenceController::class);
Route::post('motor/commands', [MotorController::class, 'sendMotorCommands']);
