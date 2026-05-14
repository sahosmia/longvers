<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clients\StoreClientRequest;
use App\Http\Requests\Clients\UpdateClientRequest;
use App\Models\Client;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('clients/index', [
            'clients' => Client::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(StoreClientRequest $request)
    {
        Client::create($request->validated());
        return redirect()->back()->with('success', 'Client created successfully.');
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());
        return redirect()->back()->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('success', 'Client deleted successfully.');
    }
}
