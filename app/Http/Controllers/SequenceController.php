<?php

namespace App\Http\Controllers;

use App\Models\Sequence;
use Illuminate\Http\Request;

class SequenceController extends Controller
{
    /**
     * Display a listing of sequences.
     */
    public function index()
    {
        $sequences = Sequence::with('shots')->get();
        return response()->json($sequences);
    }

    /**
     * Store a newly created sequence in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $sequence = Sequence::create($request->all());
        return response()->json($sequence, 201);
    }

    /**
     * Display the specified sequence.
     */
    public function show(Sequence $sequence)
    {
        $sequence->load('shots');
        return response()->json($sequence);
    }

    /**
     * Update the specified sequence in storage.
     */
    public function update(Request $request, Sequence $sequence)
    {
        $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
        ]);

        $sequence->update($request->all());
        return response()->json($sequence);
    }

    /**
     * Remove the specified sequence from storage.
     */
    public function destroy(Sequence $sequence)
    {
        $sequence->delete();
        return response()->json(null, 204);
    }

    /**
     * Get the list of shots in a sequence with their order.
     */
    public function getShots(Sequence $sequence)
    {
        $sequence->load('shots');
        return response()->json($sequence->shots);
    }
}
