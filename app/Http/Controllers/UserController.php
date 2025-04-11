<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        $this->applyFilters($query, $request);

        $users =  $query->get();
        return UserResource::collection($users);
    }

    private function applyFilters($query, Request $request)
    {
        // Add filters to search
        if ($request->filled('query')) {
            $q = $request->query('query');
            $query->where(function ($subQuery) use ($q) {
                $subQuery->where('firstName', 'like', "%{$q}%")
                    ->orWhere('lastName', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        // Filter by email
        if ($request->filled('email')) {
            $query->where('email', $request->query('email'));
        }

        // Filter by phoneNumber
        if ($request->filled('phoneNumber')) {
            $query->where('phoneNumber', $request->query('phoneNumber'));
        }
    }

    public function show(string $id) {
        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    public function store(UserCreateRequest $request)
    {
        $user =  User::create($request->validated());
        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, string $id)
    {

        $user = User::findOrFail($id);
        $user->update($request->validated());
        return new UserResource($user);
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }

    public function importMultipleUsers(Request $request)
    {
        $validated = $request->validate([
            'user' => 'required|array',
            'phoneNumber' => 'required|array',
        ]);

        $users = collect($validated['user']);
        $phoneNumberByEmail = collect($validated['phoneNumber'])->keyBy('email');

        $successStore= [];

        foreach ($users as $user) {
            $email = $user['email'];
            if($phoneNumberByEmail->has($email)){
                $phoneData = $phoneNumberByEmail[$email];
                $user = array_merge($user, $phoneData);
            }
            $storedUser = User::updateOrCreate(
                ["_id" => $user['_id']],
                $user
            );
            $successStore[] = $storedUser;
        }

        return userResource::collection($successStore);
    }
}
