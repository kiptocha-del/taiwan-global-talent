<?php

use App\Http\Controllers\Api\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// The default Sanctum route (keep this if it was generated)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Courses: published modules with the caller's certification status.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{module}', [CourseController::class, 'show']);
});
