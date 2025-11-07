<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Solicitud;
use App\Models\Usuario;

class SolicitudController extends Controller
{
    public function store(Request $request)
{
    $ci = $request->input('ci') ?? $request->input('ci_usuario');
    $ci = $ci ? preg_replace('/\D/', '', (string) $ci) : null;

    $request->merge([
        'ci'               => $ci,
        'nombre_completo'  => $request->input('nombre_completo') ?? $request->input('nombre'),
        'menores_a_cargo'  => $request->input('menores_a_cargo') ?? $request->input('menores_cargo'),
        'comentarios'      => $request->input('comentarios') ?? $request->input('intereses') ?? $request->input('mensaje'),
    ]);

    $email = $request->input('email');
    $existeUsuario = Usuario::query()
        ->when($ci, fn($q) => $q->orWhereRaw("REPLACE(REPLACE(ci_usuario,'.',''),'-','') = ?", [$ci]))
        ->when($email, fn($q) => $q->orWhere('email', $email))
        ->exists();

    if ($existeUsuario) {
        return response()->json([
            'ok'    => false,
            'error' => 'Ya existe un socio registrado con esa CI o email. Si ya sos socio, iniciá sesión.'
        ], 422);
    }

    $validated = $request->validate([
        'ci'               => ['nullable','digits_between:7,8',
            \Illuminate\Validation\Rule::unique('solicitudes','ci')
                ->where(fn($q) => $q->where('estado','pendiente'))
        ],
        'nombre_completo'  => ['required','string','max:191'],
        'email'            => ['required','email','max:191',
            \Illuminate\Validation\Rule::unique('solicitudes','email')
                ->where(fn($q) => $q->where('estado','pendiente'))
        ],
        'telefono'         => ['nullable','string','max:30'],
        'menores_a_cargo'  => ['nullable','integer','min:0','max:20'],
        'dormitorios'      => ['nullable','integer','min:0','max:10'],
        'comentarios'      => ['nullable','string'],
    ]);

    $sol = \App\Models\Solicitud::create($validated + ['estado' => 'pendiente']);

    return response()->json([
        'ok' => true,
        'message' => 'Solicitud recibida. Queda pendiente de aprobación.',
        'solicitud_id' => $sol->id,
    ], 201);
}
}