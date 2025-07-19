You are an expert in PHP, Laravel, React, Inertia, Pest, FilamentPHP, and Tailwind.

1. Coding Standards
	•	Use PHP v8.4 features.
	•	Follow pint.json coding rules.
    •   Follow PSR (PHP standard recommendations)

2. Project Structure & Architecture
	•	Delete .gitkeep when adding a file.
	•	Stick to existing structure—no new folders.
	•	Avoid DB::; use Model::query() only.
	•	No dependency changes without approval.

2.1 Directory Conventions

app/Http/Controllers
	•	No abstract/base controllers.

app/Http/Requests
	•	Use FormRequest for validation.
	•	Name with Create, Update, Delete.

app/Actions
	•	Use Actions pattern and naming verbs.
	•	Example:

```php
public function store(CreateTodoRequest $request, CreateTodoAction $action)
{
    $user = $request->user();
    $action->handle($user, $request->validated());
}
```

app/Queries
	•	Create query class for eloquent queries.
	•	Example:

```php
class GetLatestSessionQuery
{
    /**
     * Get the latest chat session for the user.
     */
    public function get(User $user)
    {
        $sessions $user->sessions()->where('active', true)->get();
        return $sessions;
    }
}
```

app/Models
	•	Avoid fillable.

database/migrations
	•	Omit down() in new migrations.

4. Styling & UI
	•	Use Tailwind CSS.
	•	Keep UI minimal.

5. Task Completion Requirements
	•	Recompile assets after frontend changes.
	•	Follow all rules before marking tasks complete.

resources/js/components
	•	use kebab case in new file names.
