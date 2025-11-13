<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ugyfel;

class UgyfelController extends Controller
{
    public function index(){
        $ugyfelek = Ugyfel::all();
        return response()->json($ugyfelek);
    }

    public function show($ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!"], 404);
        }
        return response()->json($ugyfel);
    }

    public function destroy($ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!"], 404);
        }
        $ugyfel->delete();
        return response()->json(["message" => "Ügyfél sikeresen törölve"]);
    }

    public function update(Request $request, $ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!"], 404);
        }
        $ugyfel->update($request->all());
        return response()->json($ugyfel);
    }

    public function store(Request $request){
        $validatedData = $request->validate([
            'nev' => 'required|string|max:255',
            'szig' => 'required|string|unique:ugyfelek,szig',
            'email' => 'required|email|unique:ugyfelek,email',
            'telefonszam' => 'required|string'
        ]);
        $ugyfel = Ugyfel::create($validatedData);
        return response()->json($ugyfel, 201);
    }
}
