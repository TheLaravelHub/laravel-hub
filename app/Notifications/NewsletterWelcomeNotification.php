<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterWelcomeNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct() {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Laravel Hub Newsletter!')
            ->greeting('Thank you for subscribing!')
            ->line("We're excited to have you join our newsletter community.")
            ->line("You'll receive updates about the Latest tutorials, exclusive content, and Laravel packages.")
            ->action('Explore Laravel Hub', url('/'))
            ->line('If you ever want to unsubscribe, you can click the unsubscribe link in any of our emails.');
    }
}
