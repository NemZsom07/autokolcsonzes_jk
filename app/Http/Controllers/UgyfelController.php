<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ugyfel;

class UgyfelController extends Controller
{
    public function index(){
        $uygfelek = Ugyfel::all();
        return response()->json($uygfelek);
    }

    public function show($ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!!4!!!négy!!!"]);
        }
        return response()->json($ugyfel);
    }

    public function destroy($ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!!4!!!négy!!!"]);
        }
       $ugyfel->delete();
       return response()->json(["message" => "Ügyfél sikeresen törölve"]);
    }

    public function update(Request $req, $ugyfel_id){
        $ugyfel = Ugyfel::find($ugyfel_id);
        if(!$ugyfel){
            return response()->json(["message" => "Nincs ilyen Ügyfél!!4!!!négy!!!"]);
        }
        $ugyfel->update($req->all());
        return response()->json($ugyfel);
    }

    public function store(Request $req, $ugyfel_id){
        $ugyfel = Ugyfel::create($req->all());
        return response()->json($ugyfel,201);
    }
}
