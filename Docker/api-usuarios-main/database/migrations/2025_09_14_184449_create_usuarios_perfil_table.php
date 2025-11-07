<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('usuarios_perfil')) {
            Schema::create('usuarios_perfil', function (Blueprint $t) {
                $t->engine    = 'InnoDB';
                $t->charset   = 'utf8mb4';
                $t->collation = 'utf8mb4_unicode_ci';

                $t->string('ci_usuario', 8)->primary()->collation('utf8mb4_unicode_ci');
                $t->string('contacto', 191);                    
                $t->string('direccion', 191);                  
                $t->string('ocupacion', 100);                   
                $t->decimal('ingresos_nucleo_familiar', 12, 2); 
                $t->unsignedTinyInteger('integrantes_familia'); 
                $t->boolean('acepta_declaracion_jurada');       
                $t->boolean('acepta_reglamento_interno');       
                $t->enum('estado_revision', ['pendiente','aprobado','rechazado'])->default('pendiente');
                $t->unsignedBigInteger('aprobado_por')->nullable();
                $t->timestamp('aprobado_at')->nullable();
                $t->timestamps();
                $t->foreign('ci_usuario')
                  ->references('ci_usuario')->on('usuarios')
                  ->onDelete('cascade');

                $t->index(['estado_revision']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios_perfil');
    }
};