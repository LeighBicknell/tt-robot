<?php

namespace App\Http\Controllers;

use App\Models\Shot;
use Illuminate\Http\Request;

class ShotController extends Controller
{
    /**
     * Display a listing of shots.
     */
    public function index()
    {
        $shots = Shot::all();
        return response()->json($shots);
    }

    /**
     * Store a newly created shot in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'topspin_min' => 'required|integer',
            'topspin_max' => 'required|integer',
            'backspin_min' => 'required|integer',
            'backspin_max' => 'required|integer',
        ]);

        $shot = Shot::create($request->all());
        return response()->json($shot, 201);
    }

    /**
     * Display the specified shot.
     */
    public function show(Shot $shot)
    {
        return response()->json($shot);
    }

    /**
     * Update the specified shot in storage.
     */
    public function update(Request $request, Shot $shot)
    {
        $request->validate([
            'name' => 'string|max:255',
            'topspin_min' => 'integer',
            'topspin_max' => 'integer',
            'backspin_min' => 'integer',
            'backspin_max' => 'integer',
        ]);

        $shot->update($request->all());
        return response()->json($shot);
    }

    /**
     * Remove the specified shot from storage.
     */
    public function destroy(Shot $shot)
    {
        $shot->delete();
        return response()->json(null, 204);
    }
}
