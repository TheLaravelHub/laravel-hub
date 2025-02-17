<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Thefeqy\ModelStatus\Status;

class ToggleStatusController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $model)
    {
        $modelClass = 'App\\Models\\'.ucfirst($model);
        if (! class_exists($modelClass)) {
            throw new NotFoundHttpException('Model not found');
        }

        $modelInstance = $modelClass::find($request->id);
        if (! $modelInstance) {
            throw new NotFoundHttpException('Instance not found');
        }

        $modelInstance->status = $modelInstance->status === Status::active() ? Status::inactive() : Status::active();
        $modelInstance->save();

        return redirect()
            ->back()
            ->with('message', 'Status changed successfully');
    }
}
