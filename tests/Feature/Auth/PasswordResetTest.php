<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Coderflex\LaravelTurnstile\Facades\LaravelTurnstile;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        LaravelTurnstile::shouldReceive('validate')
            ->once()
            ->andReturn(['success' => true]);

        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email,
            'cf_turnstile_response' => 'fake-response']);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        LaravelTurnstile::shouldReceive('validate')
            ->once()
            ->andReturn(['success' => true]);

        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email,
            'cf_turnstile_response' => 'fake-response', ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get('/reset-password/'.$notification->token);

            $response->assertStatus(200);

            return true;
        });
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        LaravelTurnstile::shouldReceive('validate')
            ->once()
            ->andReturn(['success' => true]);

        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', [
            'email' => $user->email,
            'cf_turnstile_response' => 'fake-response',
        ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            LaravelTurnstile::shouldReceive('validate')
                ->once()
                ->andReturn(['success' => true]);

            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
                'cf_turnstile_response' => 'fake-response',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }
}
