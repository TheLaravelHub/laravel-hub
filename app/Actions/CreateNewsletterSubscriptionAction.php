<?php

namespace App\Actions;

use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterWelcomeNotification;

class CreateNewsletterSubscriptionAction
{
    /**
     * Handle the newsletter subscription creation.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): NewsletterSubscriber
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => $data['email'],
            'is_active' => true,
        ]);
        $subscriber->notify(new NewsletterWelcomeNotification);

        return $subscriber;
    }
}
