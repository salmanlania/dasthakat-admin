<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{


    public function run()
    {
        DocumentType::truncate();

        $data = [
            ['document_type_id' => 38, 'document_name' => 'Quotation', 'document_prefix' => '{BC}/QT-', 'table_name' => 'quotation', 'primary_key' => 'quotation_id'],
            ['document_type_id' => 39, 'document_name' => 'Charge Order', 'document_prefix' => '{BC}/CO-', 'table_name' => 'charge_order', 'primary_key' => 'charge_order_id'],
            ['document_type_id' => 40, 'document_name' => 'Purchase Order', 'document_prefix' => '{BC}/PO-', 'table_name' => 'purchase_order', 'primary_key' => 'purchase_order_id'],
            ['document_type_id' => 41, 'document_name' => 'Good Received Note', 'document_prefix' => '{BC}/GRN-', 'table_name' => 'good_received_note', 'primary_key' => 'good_received_note_id'],
            ['document_type_id' => 42, 'document_name' => 'Purchase Invoice', 'document_prefix' => '{BC}/PI-', 'table_name' => 'purchase_invoice', 'primary_key' => 'purchase_invoice_id'],
        ];
        DocumentType::insert($data);
    }
}
