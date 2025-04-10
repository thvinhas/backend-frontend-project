<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('query')) {
            $q = $request->query('query');
            $query->where(function ($subQuery) use ($q) {
                $subQuery->where('firstName', 'like', "%{$q}%")
                    ->orWhere('lastName', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($request->filled('email')) {
            $query->where('email', $request->query('email'));
        }

        if ($request->filled('phoneNumber')) {
            $query->where('phoneNumber', $request->query('phoneNumber'));
        }

        $users =  $query->get();
        return UserResource::collection($users);
    }

    public function show(string $id) {
        $user =  User::findOrFail($id);
        return new UserResource($user);
    }

    public function store(UserRequest $request)
    {
        $user =  User::create($request->validated());
        return new UserResource($user);
    }

    public function update(UserRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $user->update($request->validated());
        return new UserResource($user);
    }

    public function destroy(string $id)
    {
        $user =  User::destroy($id);
        return new UserResource($user);
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'user' => 'required|array',
            'phoneNumber' => 'required|array',
        ]);

        $users = collect($validated['user']);
        $phoneNumber = collect($validated['phoneNumber']);

        $phoneNumberByEmail = $phoneNumber->keyBy('email');

        $successStore= [];

        foreach ($users as $user) {
            $email = $user['email'];
            if($phoneNumberByEmail->has($email)){
                $phoneNumber = $phoneNumberByEmail[$email];
                $user = array_merge($phoneNumber, $user);
            }

            User::updateOrCreate(
                ["_id"=>$user['_id']],
                $user
            );

            $successStore[] = $user;
        }

        return userResource::collection($successStore);
    }
}
