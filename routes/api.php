<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PairingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'partner_id' => $user->partner_id ?? null,
            'is_paired'  => $user->partner_id !== null,
        ]);
    });


    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/partners/{partner}/events', [EventController::class, 'partnerEvents']);

    // Comments
    Route::get('/events/{event}/comments', [CommentController::class, 'indexForEvent']);
    Route::post('/events/{event}/comments', [CommentController::class, 'store']);
    Route::get('/users/{user}/comments', [CommentController::class, 'indexForUser']);

    // Pairing
    Route::post('/pairing-code', [PairingController::class, 'generateCode']);
    Route::post('/pair', [PairingController::class, 'pairWithCode']);
    Route::get('/partners', [PairingController::class, 'listPartners']);
});

Route::get('/ping', fn() => response()->json(['message' => 'pong']));
