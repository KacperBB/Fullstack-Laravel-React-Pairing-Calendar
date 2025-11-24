<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Pairing;

class CommentController extends Controller
{
    // GET /api/events/{event}/comments
    public function indexForEvent(Event $event)
    {
        // w przyszłości tu możesz dodać paginację
        return response()->json(
            $event->comments()
                ->with('user:id,name') // pobierz info o autorze komentarza
                ->orderBy('created_at', 'asc')
                ->get()
        );
    }

    // GET /api/users/{user}/comments
    public function indexForUser(User $user)
    {
        return response()->json(
            $user->comments()
                ->with('event:id,title,date,start_time,end_time') // podstawowe info o eventach
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    // POST /api/events/{event}/comments
    public function store(Request $request, Event $event)
    {
        $user = $request->user();

        // sprawdź, czy user to właściciel eventu ALBO jest sparowany z właścicielem
        if ($event->user_id !== $user->id && ! Pairing::arePaired($event->user_id, $user->id)) {
            return response()->json(['message' => 'You cannot comment on this event'], 403);
        }

        $data = $request->validate([
            'content'    => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $data['user_id']  = $user->id;
        $data['event_id'] = $event->id;

        if (empty($data['content']) && empty($data['image_path'])) {
            return response()->json(['message' => 'Komentarz musi mieć tekst lub obrazek'], 422);
        }

        $comment = Comment::create($data);

        return response()->json($comment, 201);
    }
}
