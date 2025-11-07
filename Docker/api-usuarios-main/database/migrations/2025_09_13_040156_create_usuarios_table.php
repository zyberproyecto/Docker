<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('usuarios', function (Blueprint $t) {
            $t->engine    = 'InnoDB';
            $t->charset   = 'utf8mb4';
            $t->collation = 'utf8mb4_unicode_ci';

            $t->string('ci_usuario', 8)
               ->collation('utf8mb4_unicode_ci')
               ->primary();

            $t->string('primer_nombre', 50)->nullable();
            $t->string('segundo_nombre', 50)->nullable();
            $t->string('primer_apellido', 50)->nullable();
            $t->string('segundo_apellido', 50)->nullable();
            $t->string('email', 191)->nullable()->unique();
            $t->string('telefono', 30)->nullable();
            $t->string('password');
            $t->enum('estado_registro', ['pendiente','aprobado','rechazado'])
               ->default('pendiente');
            $t->string('rol', 20)->default('socio');

            $t->boolean('perfil_completo')->default(false);

            $t->rememberToken();
            $t->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('usuarios');
    }
};