<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutoController;
use App\Http\Controllers\UgyfelController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/autok",[AutoController::class,"index"]);
Route::get("/autok/{auto_id}",[AutoController::class,"show"]);
Route::post("/autok",[AutoController::class,"store"]);
Route::put("/autok/{auto_id}",[AutoController::class,"update"]);
Route::delete("/autok/{auto_id}",[AutoController::class,"destroy"]);

Route::get("/ugyfelek",[UgyfelController::class,"index"]);
Route::get("/ugyfelek/{id}",[UgyfelController::class,"show"]);
Route::post("/ugyfelek",[UgyfelController::class,"store"]);
Route::put("/ugyfelek/{uid}",[UgyfelController::class,"update"]);
Route::delete("/ugyfelek/{uid}",[UgyfelController::class,"destroy"]);

Route::get("/kolcsonzesek",[KolcsonzoController::class,"index"]);
Route::get("/kolcsonzesek/{id}",[KolcsonzoController::class,"show"]);
Route::post("/kolcsonzesek",[KolcsonzoController::class,"store"]);
Route::put("/kolcsonzesek/{kid}",[KolcsonzoController::class,"update"]);
Route::delete("/kolcsonzesek/{kid}",[KolcsonzoController::class,"destroy"]);
