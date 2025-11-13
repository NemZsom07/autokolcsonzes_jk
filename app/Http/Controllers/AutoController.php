<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auto;

class autoController extends Controller
{
    //Listázza az összes autot
    public function index(){
        $autok = Auto::all();
        return response()->json($autok);
    }

    //egyetlen auto
    public function show($aid) {
        $auto = Auto::find($aid);
        if(!$auto){
            return response()->json(["message" =>"Nincs ilyen auto"]);
        }
        return response()->json($auto);
    }

    //auto törlése
    public function destroy($aid) {
        $auto = Auto::find($aid);
        if(!$auto){
            return response()->json(["message" =>"Nincs ilyen auto"]);
        }
        $auto->delete();
        return response()->json(["message" => "auto törölv"]);
    }

    //aut o frissitése
    public function update(Request $req, $aid) {
        $auto = Auto::find($aid);
        if(!$auto){
            return response()->json(["message" =>"Nincs ilyen auto"]);
        }
        $auto->update($req->all());
        return response()->json($auto);
    }

    public function store(Request $req){
        $auto = Auto::create($req->all());
        return response()->json($auto);

    }

}

