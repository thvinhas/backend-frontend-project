<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserApiTest extends TestCase
{
  use RefreshDatabase;

  public function testListUser(): void
  {
      User::factory()->count(3)->create();

      $response = $this->getJson('/api/users');

      $response->assertStatus(200)
          ->assertJsonCount(3, 'data');
  }

  public function testFilterUsersByQuery(): void
  {
      User::factory()->create(['firstName' => 'Marina', 'email' =>  'marina@wiline.com']);
      User::factory()->create(['firstName' => 'Kip', 'email' =>  'kip@wiline.com']);

      $response = $this->getJson('/api/users?query=Marina');

      $response->assertStatus(200)
          ->assertJsonFragment(['firstName' => 'Marina', ]);
  }

  public function testFilterUserByEmail(): void
  {
      User::factory()->create(['email' =>  'marina@wiline.com']);
      User::factory()->create(['email' =>  'kip@wiline.com']);

      $response = $this->getJson('/api/users?email=marina@wiline.com');
      $response->assertStatus(200)
          ->assertJsonCount(1)
          ->assertJsonFragment(["email" => "marina@wiline.com"]);
  }

  public function testFilterUserByPhoneNumber(): void
  {
      User::factory()->create(['phoneNumber' =>  '0123456789']);
      User::factory()->create(['phoneNumber' =>  '7472647585']);

      $response = $this->getJson('/api/users?phoneNumber=7472647585');
      $response->assertStatus(200)
          ->assertJsonCount(1)
          ->assertJsonFragment(["phoneNumber" => "7472647585"]);
  }

  public function testCreateUser(): void
  {
      $payload = [
          "_id" =>'user123',
          'firstName' => 'Marina',
          'email' => 'marina@wiline.com',
          'phoneNumber' => '7472647585',
          'lastName' => 'Orozco',
      ];

      $response = $this->postJson('/api/users', $payload);

      $response->assertStatus(201)
          ->assertJsonFragment(['email' => 'marina@wiline.com']);

      $this->assertDatabaseHas('users', $payload);
  }

  public function testUpdateUser(): void
  {
      $user = User::factory()->create(['_id'=>'user123', 'firstName' => 'Marina']);

      $updatedUser = [
          'firstName' => 'New',
          'lastName' => $user->lastName,
          'email' => $user->email,
          'phoneNumber' => $user->phoneNumber,
      ];
      $response = $this->putJson('/api/users/'.$user->_id, $updatedUser);

      $response->assertStatus(200)
          ->assertJsonFragment(['firstName' => 'New']);

      $this->assertDatabaseHas('users', ['_id'=>'user123', 'firstName' => 'New']);
  }

  public function testDeleteUser(): void
  {
      $user = User::factory()->create(['_id'=>'delete']);

      $response = $this->deleteJson('/api/users/'.$user->_id);
      $response->assertStatus(204);

      $this->assertDatabaseMissing('users', ['_id'=>'delete']);
  }

  public function testImportMultipleUsers(): void
  {
      $userArray = [
          [
              '_id' => 'user1',
              'firstName' => 'Marina',
              'lastName' => 'Orozco',
              'email' => 'marina@wiline.com'
          ],
          [
              '_id' => 'user2',
              'firstName' => 'Lorie',
              'lastName' => 'Avery',
              'email' => 'lorie@wiline.com'
          ],
      ];
      $phoneNumberArray = [
          [
              'email' => 'marina@wiline.com',
              'phoneNumber' => '11111111'
          ],
          [
              'email' => 'lorie@wiline.com',
              'phoneNumber' => '222222222'
          ]
      ];

      $payload = [
          'user' => $userArray,
          'phoneNumber' => $phoneNumberArray
      ];

      $response = $this->postJson('/api/users/importMultipleUsers', $payload);

      $response->assertStatus(200)
          ->assertJsonCount(2,'data');

      $this->assertDatabaseHas('users', ['_id' => 'user1', 'phoneNumber' => '11111111']);
      $this->assertDatabaseHas('users', ['_id' => 'user2', 'phoneNumber' => '222222222']);
  }
}
