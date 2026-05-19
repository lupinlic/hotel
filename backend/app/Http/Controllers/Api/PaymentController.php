<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends BaseController
{
    public function index()
    {
        $this->checkAdmin();

        return Payment::with('booking')->get();
    }

    public function show($id)
    {
        return Payment::with('booking')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $method = $request->payment_method ?? $request->method;

        // Chuẩn hóa method từ trường input cũ hoặc các giá trị UI
        if (in_array($method, ['bank', 'bank_transfer'])) {
            $method = 'bank_transfer';
        } elseif (in_array($method, ['cash', 'hotel'])) {
            $method = 'cash';
        }

        $status = 'pending';

        // Nếu khách thanh toán chuyển khoản thì tính là đã thanh toán.
        // Nếu thanh toán tại quầy thì vẫn giữ pending.
        if ($method === 'bank_transfer') {
            $status = 'paid';
        } elseif ($method === 'cash') {
            $status = 'pending';
        }

        return Payment::create([
            'booking_id' => $request->booking_id,
            'amount' => $request->amount,
            'method' => $method,
            'status' => $status,
        ]);
    }
}