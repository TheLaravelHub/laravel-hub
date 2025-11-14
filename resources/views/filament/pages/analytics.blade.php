<x-filament-panels::page>
    <div class="space-y-6">
        @foreach ($this->getVisibleWidgets() as $widget)
            @livewire($widget)
        @endforeach
    </div>
</x-filament-panels::page>
