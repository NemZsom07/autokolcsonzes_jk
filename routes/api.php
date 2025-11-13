<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; 
use App\Http\Controllers\UgyfelController;
use App\Http\Controllers\KolcsonzesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/ugyfel", [UgyfelController::class, "index"]);
Route::get("/ugyfel/{ugyfel_id}", [UgyfelController::class, "show"]);
Route::post("/ugyfel", [UgyfelController::class, "store"]);
Route::put("/ugyfel/{ugyfel_id}", [UgyfelController::class, "update"]);
Route::delete("/ugyfel/{ugyfel_id}", [UgyfelController::class, "destroy"]);

Route::get("/kolcsonzes", [KolcsonzesController::class, "index"]);
Route::get("/kolcsonzes/{kolcsonzes_id}", [KolcsonzesController::class, "show"]);
Route::post("/kolcsonzes", [KolcsonzesController::class, "store"]);
Route::put("/kolcsonzes/{kolcsonzes_id}", [KolcsonzesController::class, "update"]);
Route::delete("/kolcsonzes/{kolcsonzes_id}", [KolcsonzesController::class, "destroy"]);
