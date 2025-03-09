<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasStatus;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Set;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Index extends Model implements HasMedia
{
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $table = 'indexes';

    protected $fillable = ['name', 'description', 'slug', 'color_code'];

    protected array $cascadeDeactivate = ['packages'];

    //    protected function casts()
    //    {
    //        return [
    //            'status' => StatusCast::class,
    //        ];
    //    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class);
    }

    public static function getFormSchema(): array
    {
        return [
            Grid::make(3)
                ->schema([
                    Grid::make()
                        ->columnSpan(2)
                        ->schema([
                            Section::make('Index Details')
                                ->columns(2)
                                ->schema([
                                    TextInput::make('name')
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (Set $set, ?string $state) {
                                            $set('slug', Str::slug($state));
                                        })
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required(),
                                    Textarea::make('description')
                                        ->columnSpanFull()
                                        ->required()
                                        ->columnSpanFull(),
                                ]),
                        ]),
                    Grid::make()
                        ->columnSpan(1)
                        ->schema([
                            Section::make('Status')
                                ->schema([
                                    ColorPicker::make('color_code')
                                        ->required(),
                                    Toggle::make('status')
                                        ->default('active')
                                        ->onIcon('heroicon-o-check-circle')
                                        ->offIcon('heroicon-o-x-circle')
                                        ->onColor('success')
                                        ->offColor('danger')
                                        ->afterStateHydrated(fn ($state, callable $set) => $set('status', $state === 'active')),
                                    SpatieMediaLibraryFileUpload::make('icon')
                                        ->avatar()
                                        ->imageEditor(),
                                ]),
                        ]),
                ]),
        ];
    }
}
