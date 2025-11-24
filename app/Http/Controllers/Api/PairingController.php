<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pairing;
use App\Models\PairingCode;
use App\Models\User;
use Illuminate\Http\Request;

class PairingController extends Controller
{
    // POST /api/pairing-code
    public function generateCode(Request $request)
    {
        $user = $request->user();

        // opcjonalnie: usuń stare aktywne kody usera
        PairingCode::where('user_id', $user->id)
            ->whereNull('used_at')
            ->delete();

        $code = PairingCode::generateForUser($user->id, 60);

        return response()->json([
            'code'       => $code->code,
            'expires_at' => $code->expires_at,
        ]);
    }

    // POST /api/pair { code: "ABCDEFGH" }
    public function pairWithCode(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'code' => ['required', 'string'],
        ]);

        $pairingCode = PairingCode::where('code', $data['code'])->first();

        if (! $pairingCode || ! $pairingCode->isValid()) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        if ($pairingCode->user_id === $user->id) {
            return response()->json(['message' => 'You cannot pair with yourself'], 422);
        }

        // uporządkuj id
        [$a, $b] = $user->id < $pairingCode->user_id
            ? [$user->id, $pairingCode->user_id]
            : [$pairingCode->user_id, $user->id];

        // sprawdź, czy już są sparowani
        $existing = Pairing::where('user_a_id', $a)
            ->where('user_b_id', $b)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Users are already paired'], 200);
        }

        Pairing::create([
            'user_a_id' => $a,
            'user_b_id' => $b,
        ]);

        $pairingCode->used_at = now();
        $pairingCode->save();

        return response()->json(['message' => 'Paired successfully']);
    }

    // GET /api/partners
    public function listPartners(Request $request)
    {
        $user = $request->user();

        $pairings = Pairing::partnersFor($user->id);

        $partners = $pairings->map(function (Pairing $p) use ($user) {
            $partnerId = $p->user_a_id === $user->id ? $p->user_b_id : $p->user_a_id;
            $partner   = User::find($partnerId);

            return [
                'id'   => $partner->id,
                'name' => $partner->name,
                'email'=> $partner->email,
            ];
        });

        return response()->json($partners->values());
    }
}
