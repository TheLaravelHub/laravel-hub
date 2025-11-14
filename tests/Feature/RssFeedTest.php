<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RssFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_rss_feed_returns_successful_response(): void
    {
        $response = $this->get('/rss/blog');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml;charset=UTF-8');
    }

    public function test_packages_rss_feed_returns_successful_response(): void
    {
        $response = $this->get('/rss/packages');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml;charset=UTF-8');
    }

    public function test_combined_rss_feed_returns_successful_response(): void
    {
        $response = $this->get('/rss/feed');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml;charset=UTF-8');
    }

    public function test_blog_rss_feed_contains_valid_xml(): void
    {
        $response = $this->get('/rss/blog');

        $this->assertStringContainsString('<?xml version="1.0" encoding="UTF-8"?>', $response->content());
        $this->assertStringContainsString('<rss version="2.0"', $response->content());
        $this->assertStringContainsString('<channel>', $response->content());
        $this->assertStringContainsString('</channel>', $response->content());
        $this->assertStringContainsString('</rss>', $response->content());
    }

    public function test_blog_rss_feed_includes_published_posts(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category_type' => BlogPost::class,
        ]);

        $blogPost = BlogPost::create([
            'author_id' => $user->id,
            'title' => 'Test Blog Post',
            'sub_title' => 'This is a test subtitle',
            'slug' => 'test-blog-post',
            'content' => 'This is test content for the blog post.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $blogPost->categories()->attach($category);

        $response = $this->get('/rss/blog');

        $response->assertStatus(200);
        $this->assertStringContainsString('Test Blog Post', $response->content());
        $this->assertStringContainsString('This is a test subtitle', $response->content());
    }

    public function test_packages_rss_feed_includes_active_packages(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Authentication',
            'slug' => 'authentication',
            'category_type' => Package::class,
        ]);

        $package = Package::create([
            'user_id' => $user->id,
            'name' => 'Test Package',
            'slug' => 'test-package',
            'description' => 'This is a test package description',
            'repository_url' => 'https://github.com/user/test-package',
            'language' => 'PHP',
            'stars' => 100,
            'owner' => 'testuser',
            'status' => 'active',
        ]);

        $package->categories()->attach($category);

        $response = $this->get('/rss/packages');

        $response->assertStatus(200);
        $this->assertStringContainsString('Test Package', $response->content());
        $this->assertStringContainsString('This is a test package description', $response->content());
    }

    public function test_combined_rss_feed_includes_both_posts_and_packages(): void
    {
        $user = User::factory()->create();

        $blogCategory = Category::create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category_type' => BlogPost::class,
        ]);

        $packageCategory = Category::create([
            'name' => 'Authentication',
            'slug' => 'authentication',
            'category_type' => Package::class,
        ]);

        $blogPost = BlogPost::create([
            'author_id' => $user->id,
            'title' => 'Test Blog Post',
            'sub_title' => 'This is a test subtitle',
            'slug' => 'test-blog-post',
            'content' => 'This is test content for the blog post.',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $blogPost->categories()->attach($blogCategory);

        $package = Package::create([
            'user_id' => $user->id,
            'name' => 'Test Package',
            'slug' => 'test-package',
            'description' => 'This is a test package description',
            'repository_url' => 'https://github.com/user/test-package',
            'language' => 'PHP',
            'stars' => 100,
            'owner' => 'testuser',
            'status' => 'active',
        ]);

        $package->categories()->attach($packageCategory);

        $response = $this->get('/rss/feed');

        $response->assertStatus(200);
        $this->assertStringContainsString('[Blog Post] Test Blog Post', $response->content());
        $this->assertStringContainsString('[Package] Test Package', $response->content());
    }

    public function test_rss_feeds_have_proper_route_names(): void
    {
        $this->assertTrue(route('feeds.blog') !== null);
        $this->assertTrue(route('feeds.packages') !== null);
        $this->assertTrue(route('feeds.combined') !== null);
    }
}
