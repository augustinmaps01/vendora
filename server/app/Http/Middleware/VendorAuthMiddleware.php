<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Vendor;

class VendorAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Attempt to authenticate using JWT
            $user = JWTAuth::parseToken()->authenticate();

            // Check if user exists
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 401);
            }

            // Check if authenticated user is a Vendor
            if (!($user instanceof Vendor)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Vendor access required.'
                ], 403);
            }

            // Check if vendor email is verified
            if (!$user->email_verified_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email verification required'
                ], 403);
            }

            // Check if account is locked
            if ($user->account_locked_until && $user->account_locked_until->isFuture()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is temporarily locked. Please try again later.'
                ], 403);
            }

            // Check if vendor subscription is active or in trial
            if (!in_array($user->subscription_status, ['active', 'trial'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your subscription is ' . $user->subscription_status . '. Please renew to continue.'
                ], 403);
            }

            // Attach authenticated vendor to request
            $request->merge(['vendor' => $user]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid or expired'
            ], 401);
        }

        return $next($request);
    }
}
