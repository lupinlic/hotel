<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class BaseController extends Controller
{
    protected function checkAdmin()
    {
        if (!auth()->user() || auth()->user()->role !== 'admin') {
            abort(403, 'Forbidden');
        }
    }
}