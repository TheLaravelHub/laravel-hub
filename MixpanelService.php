<?php

declare(strict_types=1);

namespace App\Services;

use Mixpanel;

final class MixpanelService
{
    private $mixpanel;

    public function __construct()
    {
        $this->mixpanel = Mixpanel::getInstance(env('MIXPANEL_TOKEN'));
    }

    public function trackEvent(string $eventName, array $properties = []): void
    {
        $this->mixpanel->track($eventName, $properties);
    }

    public function identifyUser(string $distinctId, array $properties = []): void
    {
        $this->mixpanel->identify($distinctId);
        $this->mixpanel->people->set($distinctId, $properties);
    }
}
