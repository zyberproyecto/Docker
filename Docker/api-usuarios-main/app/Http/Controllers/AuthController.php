<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function findUserByLogin(string $login): ?Usuario
    {
        $login = trim($login);

      
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            return Usuario::where('email', $login)->first();
        }

        if (!preg_match('/^\d{7,8}$/', $login)) {
            throw ValidationException::withMessages([
                'login' => 'La CI debe ingresarse sin puntos ni guiones (solo 7 u 8 dígitos).',
            ]);
        }
        return Usuario::whereRaw(
            "REGEXP_REPLACE(ci_usuario, '[^0-9]', '') = ?",
            [$login]
        )->first();
    }

    
    public function login(Request $request)
    {
        $data = $request->validate([
            'login'    => ['required','string'],
            'password' => ['required','string'],
        ]);

        $user = $this->findUserByLogin($data['login']);

        if (!$user) {
            throw ValidationException::withMessages([
                'login' => 'Usuario no encontrado.',
            ]);
        }

        if (!Hash::check($data['password'], (string) $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'Credenciales inválidas.',
            ]);
        }

        if (mb_strtolower((string)($user->rol ?? '')) !== 'socio') {
            return response()->json([
                'ok'   => false,
                'error'=> 'Solo socios pueden iniciar sesión.',
            ], 403);
        }

        $estado     = $user->estado_registro ?? $user->estado ?? null;
        $estadoNorm = $estado ? mb_strtolower($estado) : null;
        $aprobado   = in_array($estadoNorm, ['aprobado','aprobada','ok','activo','activa'], true);

        if (!$aprobado) {
            return response()->json([
                'ok'     => false,
                'error'  => 'Usuario no aprobado aún.',
                'estado' => $estado ?? 'pendiente',
            ], 403);
        }

        $token = $user->createToken('socio-token', ['socio'])->plainTextToken;

        return response()->json([
            'ok'    => true,
            'token' => $token,
            'user'  => [
                'id'         => $user->id ?? null,
                'rol'        => 'socio',
                'estado'     => $estadoNorm ?? 'aprobado',
                'ci_usuario' => $user->ci_usuario,
                'email'      => $user->email,
                'nombre'     => $user->nombre
                                  ?? ($user->primer_nombre ?? null)
                                  ?? ($user->name ?? null),
            ],
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user();
        if (!$u) return response()->json(['ok' => false], 401);

        $estado = $u->estado_registro ?? $u->estado ?? 'aprobado';

        return response()->json([
            'ok'   => true,
            'user' => [
                'id'         => $u->id ?? null,
                'rol'        => 'socio',
                'estado'     => $estado,
                'ci_usuario' => $u->ci_usuario ?? null,
                'email'      => $u->email ?? null,
                'nombre'     => $u->nombre
                                  ?? ($u->primer_nombre ?? null)
                                  ?? ($u->name ?? null),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }
        return response()->json(['ok' => true]);
    }
}