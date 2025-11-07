<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioPerfil extends Model
{
    protected $table = 'usuarios_perfil';
    protected $primaryKey = 'ci_usuario';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ci_usuario',
        'ocupacion',
        'ingresos_nucleo_familiar',
        'integrantes_familia',
        'contacto',
        'direccion',
        'acepta_declaracion_jurada',
        'acepta_reglamento_interno',
        'estado_revision',
        'aprobado_por',
        'aprobado_at',
    ];

    protected $casts = [
        'ingresos_nucleo_familiar'   => 'decimal:2',
        'integrantes_familia'        => 'integer',
        'acepta_declaracion_jurada'  => 'boolean',
        'acepta_reglamento_interno'  => 'boolean',
        'aprobado_por'               => 'integer',
        'aprobado_at'                => 'datetime',
        'created_at'                 => 'datetime',
        'updated_at'                 => 'datetime',
    ];
}