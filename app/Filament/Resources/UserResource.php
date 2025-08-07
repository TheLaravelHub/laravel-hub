<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationGroup = 'Users';

    protected static ?string $recordTitleAttribute = 'email';

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        $avatarUrl = $record->avatar;

        if (! $avatarUrl) {
            $initials = substr($record->name, 0, 2);
            $avatarUrl = 'https://ui-avatars.com/api/?name='.urlencode($initials).'&color=FFFFFF&background=111827';
        }

        return [
            'Name' => $record->name,
            'Avatar' => new \Illuminate\Support\HtmlString(
                '<div class="flex items-center justify-end w-full">
                    <img src="'.$avatarUrl.'" class="w-8 h-8 rounded-full object-cover" alt="'.$record->name.'" />
                </div>'
            ),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()
            ->withCount('packages')
            ->latest('created_at');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'success';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                \Filament\Forms\Components\Section::make('User Information')
                    ->description('Basic user information')
                    ->columns(2)
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('name')
                            ->label('Name')
                            ->required(),
                        \Filament\Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required(),
                        \Filament\Forms\Components\TextInput::make('username')
                            ->label('Username')
                            ->required(),
                        \Filament\Forms\Components\DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->nullable(),
                    ]),

                \Filament\Forms\Components\Section::make('User Profile')
                    ->description('Profile settings and appearance')
                    ->columns(2)
                    ->schema([
                        \Filament\Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->default('active')
                            ->required(),
                    ]),

                \Filament\Forms\Components\Section::make('Security & Permissions')
                    ->description('User access and security settings')
                    ->columns(2)
                    ->schema([
                        \Filament\Forms\Components\Toggle::make('is_admin')
                            ->label('Admin Access')
                            ->columnSpan(2)
                            ->helperText('Grant administrative privileges to this user')
                            ->default(false),
                        \Filament\Forms\Components\TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => ! empty($state) ? bcrypt($state) : null)
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->confirmed(),
                        \Filament\Forms\Components\TextInput::make('password_confirmation')
                            ->label('Confirm Password')
                            ->password()
                            ->dehydrated(false)
                            ->required(fn (string $context): bool => $context === 'create'),
                    ]),

                \Filament\Forms\Components\Section::make('Social Authentication')
                    ->description('Social login information')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('provider_type')
                            ->label('Provider Type')
                            ->disabled()
                            ->nullable(),
                        \Filament\Forms\Components\TextInput::make('provider_id')
                            ->label('Provider ID')
                            ->disabled()
                            ->nullable(),
                    ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('User Information')
                    ->columns(2)
                    ->schema([
                        Infolists\Components\TextEntry::make('name')
                            ->label('Name'),
                        Infolists\Components\TextEntry::make('email')
                            ->label('Email'),
                        Infolists\Components\TextEntry::make('username')
                            ->label('Username'),
                        Infolists\Components\TextEntry::make('email_verified_at')
                            ->label('Email Verified')
                            ->formatStateUsing(fn ($state) => $state ? 'Yes' : 'No'),
                    ]),

                Infolists\Components\Section::make('User Profile')
                    ->columns(2)
                    ->schema([
                        Infolists\Components\ImageEntry::make('avatar')
                            ->label('Avatar')
                            ->circular()
                            ->defaultImageUrl(function ($record) {
                                $initials = substr($record->name, 0, 2);

                                return 'https://ui-avatars.com/api/?name='.urlencode($initials).'&color=FFFFFF&background=111827';
                            }),
                        Infolists\Components\TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'active' => 'success',
                                'inactive' => 'danger',
                                default => 'gray',
                            }),
                    ]),

                Infolists\Components\Section::make('Security & Permissions')
                    ->columns(2)
                    ->schema([
                        Infolists\Components\IconEntry::make('is_admin')
                            ->label('Admin Access')
                            ->boolean(),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Registered On')
                            ->dateTime(),
                    ]),

                Infolists\Components\Section::make('Social Authentication')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        Infolists\Components\TextEntry::make('provider_type')
                            ->label('Provider Type'),
                        Infolists\Components\TextEntry::make('provider_id')
                            ->label('Provider ID'),
                    ]),

                Infolists\Components\Section::make('User Activity')
                    ->schema([
                        Infolists\Components\TextEntry::make('packages_count')
                            ->label('Total Packages')
                            ->formatStateUsing(fn ($record) => $record->packages_count ?? 0),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->label('Last Updated')
                            ->dateTime(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl(function ($record) {
                        $initials = substr($record->name, 0, 2);

                        return 'https://ui-avatars.com/api/?name='.urlencode($initials).'&color=FFFFFF&background=111827';
                    }),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('username')
                    ->searchable(),
                Tables\Columns\TextColumn::make('packages_count')
                    ->label('Packages')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('delete')
                    ->label('Delete')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (User $user) => $user->delete())
                    ->visible(fn (User $user) => ! $user->trashed()),

                Tables\Actions\RestoreAction::make()
                    ->requiresConfirmation()
                    ->visible(fn (User $user) => $user->trashed()),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'view' => Pages\ViewUser::route('/{record}'),
        ];
    }
}
