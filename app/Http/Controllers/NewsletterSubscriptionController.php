<?php

namespace App\Http\Controllers;

use App\Actions\CreateNewsletterSubscriptionAction;
use App\Http\Requests\CreateNewsletterSubscriptionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class NewsletterSubscriptionController extends Controller
{
    public function __invoke(CreateNewsletterSubscriptionRequest $request, CreateNewsletterSubscriptionAction $action): RedirectResponse
    {
        $action->handle($request->validated());

        return Redirect::back()->with('success', 'Thanks for subscribing!');
    }
}
