<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kolcsonzes extends Model
{
    public $table = "kolcsonzes";
    public $primaryKey = "kolcsonzes_id";
    public $timestamps = false;
    public $guarded = [];
}
