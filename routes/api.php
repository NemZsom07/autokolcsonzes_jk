<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutoController;
use App\Http\Controllers\UgyfelController;
use App\Http\Controllers\KolcsonzesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/autok", [AutoController::class, "index"]);
Route::get("/autok/{id}", [AutoController::class, "show"]);
Route::post("/autok", [AutoController::class, "store"]);
Route::put("/autok/{aid}", [AutoController::class, "update"]);
Route::delete("/autok/{aid}", [AutoController::class, "destroy"]);

Route::get("/ugyfelek", [UgyfelController::class, "index"]);
Route::get("/ugyfelek/{id}", [UgyfelController::class, "show"]);
Route::post("/ugyfelek", [UgyfelController::class, "store"]);
Route::put("/ugyfelek/{uid}", [UgyfelController::class, "update"]);
Route::delete("/ugyfelek/{uid}", [UgyfelController::class, "destroy"]);

Route::get("/kolcsonzesek", [KolcsonzesController::class, "index"]);
Route::get("/kolcsonzesek/{id}", [KolcsonzesController::class, "show"]);
Route::post("/kolcsonzesek", [KolcsonzesController::class, "store"]);
Route::put("/kolcsonzesek/{kid}", [KolcsonzesController::class, "update"]);
Route::delete("/kolcsonzesek/{kid}", [KolcsonzesController::class, "destroy"]);
