<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;
    protected $table = 'usuarios';
    protected $primaryKey = 'ci_usuario';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ci_usuario',
        'email',
        'password',
        'estado_registro',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function setCiUsuarioAttribute($value)
    {
        $this->attributes['ci_usuario'] = substr(preg_replace('/\D/', '', (string) $value), 0, 8);
    }
}