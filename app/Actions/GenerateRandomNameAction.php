<?php

namespace App\Actions;

class GenerateRandomNameAction
{
    /**
     * List of adjectives for random name generation.
     *
     * @var array<string>
     */
    private array $adjectives = [
        'Amazing', 'Brave', 'Calm', 'Daring', 'Eager', 'Friendly', 'Gentle', 'Happy',
        'Intelligent', 'Jolly', 'Kind', 'Lively', 'Mysterious', 'Noble', 'Optimistic',
        'Patient', 'Quirky', 'Reliable', 'Sincere', 'Thoughtful', 'Unique', 'Vibrant',
        'Witty', 'Xcellent', 'Youthful', 'Zealous',
    ];

    /**
     * List of nouns for random name generation.
     *
     * @var array<string>
     */
    private array $nouns = [
        'Astronaut', 'Builder', 'Coder', 'Developer', 'Explorer', 'Falcon', 'Gamer',
        'Hacker', 'Inventor', 'Jumper', 'Knight', 'Lion', 'Maker', 'Navigator',
        'Owl', 'Penguin', 'Quasar', 'Rocket', 'Sailor', 'Tiger', 'Unicorn',
        'Voyager', 'Wizard', 'Xylophone', 'Yeti', 'Zebra',
    ];

    /**
     * Generate a Reddit-style random name.
     * Format: Adjective + Noun + Random number (optional)
     */
    public function handle(): string
    {
        $adjective = $this->adjectives[array_rand($this->adjectives)];
        $noun = $this->nouns[array_rand($this->nouns)];

        $addNumber = (bool) random_int(0, 1);
        $suffix = $addNumber ? random_int(1, 999) : '';

        return $adjective.$noun.$suffix;
    }
}
