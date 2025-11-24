<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use App\Models\Pairing;
use App\Models\User;

class EventController extends Controller
{
    // GET /api/events?date=YYYY-MM-DD
public function index(Request $request)
{
    $user = $request->user();

    if (! $user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $query = Event::query()
        ->where('user_id', $user->id);

    if ($request->has('date')) {
        $query->where('date', $request->query('date'));
    }

    return response()->json($query->orderBy('start_time')->get());
}


    // POST /api/events
    public function store(Request $request)
    {

        $user = $request->user();

        if(! $user) {
            return response() -> json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'date'       => ['required', 'date'],
            'start_time' => ['required'],
            'end_time'   => ['required'],
            'title'      => ['required', 'string', 'max:255'],
            'color'      => ['nullable', 'string', 'max:20'],
            'icon'       => ['nullable', 'string', 'max:50'],
            'note'       => ['nullable', 'string'],
        ]);

            $data['user_id'] = $user->id;

            $event = Event::create($data);

            return response()->json($event, 201);
    }

    // GET /api/partners/{partner}/events?date=YYYY-MM-DD
    public function partnerEvents(Request $request, User $partner)
    {
        $user = $request->user();

        if (! Pairing::arePaired($user->id, $partner->id)) {
            return response()->json(['message' => 'Not paired with this user'], 403);
        }

        $query = Event::query()
            ->where('user_id', $partner->id);

        if ($request->has('date')) {
            $query->where('date', $request->query('date'));
        }

        return response()->json(
            $query->orderBy('start_time')->get()
        );
    }
 }
