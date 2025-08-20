<?php

namespace App\Notifications;

use App\Models\PackageSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PackageApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected PackageSubmission $packageSubmission
    ) {}

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
            ->subject('Your Package Has Been Approved!')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('We are pleased to inform you that your package submission has been approved and is now listed on Laravel Hub.')
            ->line('Repository: '.$this->packageSubmission->repository_url)
            ->action('View Your Package', url('/packages'))
            ->line('Thank you for contributing to the Laravel community!')
            ->salutation('The Laravel Hub Team');
    }
}
