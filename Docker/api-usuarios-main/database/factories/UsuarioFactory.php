<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'ci_usuario'     => $this->faker->unique()->numerify('########'),
            'nombre'         => $this->faker->name(),
            'email'          => $this->faker->unique()->safeEmail(),
            'password'       => Hash::make('soc123'),
            'estado_registro'=> 'pendiente', // luego el Backoffice lo aprueba
            'rol'            => 'socio',     // 👈 siempre socio en esta API
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }

    public function aprobado(): static
    {
        return $this->state(fn () => ['estado_registro' => 'aprobado']);
    }
}
