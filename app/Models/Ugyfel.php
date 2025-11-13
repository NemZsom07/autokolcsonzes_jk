<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ugyfel extends Model
{
    public $table = "ugyfelek";
    public $primaryKey = "ugyfel_id";
    public $timestamps = false;
    public $guarded = [];
}
