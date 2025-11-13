<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\KolcsonzesController;

class KolcsonzesController extends Controller
{
    public function index(){
        $kolcsonzesek = Kolcsonzes::all();
        return response()->json($kolcsonzesek);
    }

    public function show($kolcsonzes_id){
        $kolcsonzes = Kolcsonzes::find($kolcsonzes_id);
        if(!$kolcsonzes){
            return response()->json(["message" => "Nincs ilyen Kölcsünzés!!4!!!négy!!!"]);
        }
        return response()->json($kolcsonzes);
    }

    public function destroy($kolcsonzes_id){
        $kolcsonzes = Kolcsonzes::find($kolcsonzes_id);
        if(!$kolcsonzes){
            return response()->json(["message" => "Nincs ilyen Kölcsünzés!!4!!!négy!!!"]);
        }
       $kolcsonzes->delete();
       return response()->json(["message" => "Ügyfél sikeresen törölve"]);
    }

    public function update(Request $req, $kolcsonzes_id){
        $kolcsonzes = Kolcsonzes::find($kolcsonzes_id);
        if(!$kolcsonzes){
            return response()->json(["message" => "Nincs ilyen Kölcsünzés!!4!!!négy!!!"]);
        }
        $kolcsonzes->update($req->all());
        return response()->json($kolcsonzes);
    }

    public function store(Request $req, $kolcsonzes_id){
        $kolcsonzes = Kolcsonzes::create($req->all());
        return response()->json($kolcsonzes,201);
    }
}
