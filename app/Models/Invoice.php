<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'date',
        'client_id',
        'outlet_id',
        'total',
        'paid',
        'due',
        'status',
        'method',
        'remarks',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
