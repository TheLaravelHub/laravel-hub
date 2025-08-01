<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterWelcomeNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class NewsletterSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe_to_newsletter(): void
    {
        Notification::fake();

        $response = $this->post(route('newsletter.subscribe'), [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(302)
            ->assertSessionHas('success', 'Thanks for subscribing!');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'test@example.com',
            'is_active' => true,
        ]);

        Notification::assertSentTo(
            NewsletterSubscriber::where('email', 'test@example.com')->first(),
            NewsletterWelcomeNotification::class
        );
    }

    public function test_user_cannot_subscribe_with_invalid_email(): void
    {
        $response = $this->post(route('newsletter.subscribe'), [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(302)
            ->assertSessionHasErrors(['email']);

        $this->assertDatabaseMissing('newsletter_subscribers', [
            'email' => 'not-an-email',
        ]);
    }

    public function test_user_cannot_subscribe_with_duplicate_email(): void
    {
        NewsletterSubscriber::create([
            'email' => 'duplicate@example.com',
            'is_active' => true,
        ]);

        $response = $this->post(route('newsletter.subscribe'), [
            'email' => 'duplicate@example.com',
        ]);

        $response->assertStatus(302)
            ->assertSessionHasErrors(['email']);

        $this->assertEquals(1, NewsletterSubscriber::where('email', 'duplicate@example.com')->count());
    }

    public function test_subscription_is_throttled(): void
    {
        $this->post(route('newsletter.subscribe'), [
            'email' => 'throttle@example.com',
        ])->assertStatus(302);

        $response = $this->post(route('newsletter.subscribe'), [
            'email' => 'another@example.com',
        ]);

        $response->assertStatus(429);
    }
}
