<x-filament-widgets::widget>
    <div class="mb-4 flex justify-end">
        <select
            wire:model.live="filter"
            class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
        </select>
    </div>

    <x-filament::grid
        :default="$this->getColumns('default')"
        :sm="$this->getColumns('sm')"
        :md="$this->getColumns('md')"
        :lg="$this->getColumns('lg')"
        :xl="$this->getColumns('xl')"
        :two-xl="$this->getColumns('2xl')"
        class="gap-6"
    >
        @foreach ($this->getCachedStats() as $stat)
            {{ $stat }}
        @endforeach
    </x-filament::grid>
</x-filament-widgets::widget>
