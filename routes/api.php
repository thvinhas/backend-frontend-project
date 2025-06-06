<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('/users', UserController::class);
Route::post('users/importMultipleUsers', [UserController::class, 'importMultipleUsers']);
