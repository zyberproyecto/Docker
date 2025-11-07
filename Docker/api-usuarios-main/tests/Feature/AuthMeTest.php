<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthMeTest extends TestCase
{
    public function test_me_requires_auth(): void
    {
        $response = $this->get('/api/v1/me');
        $response->assertStatus(302); // or 401 depending on guard config
    }
}

