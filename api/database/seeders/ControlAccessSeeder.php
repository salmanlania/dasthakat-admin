<?php

namespace Database\Seeders;

use App\Models\ControlAccess;
use Illuminate\Database\Seeder;

class ControlAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [

            ['module_name' => 'General Group', 'form_name' => 'Company', 'route' => 'company', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Company', 'route' => 'company', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Company', 'route' => 'company', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Company', 'route' => 'company', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Company Branch', 'route' => 'company_branch', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Company Branch', 'route' => 'company_branch', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Company Branch', 'route' => 'company_branch', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Company Branch', 'route' => 'company_branch', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Company Settings', 'route' => 'setting', 'permission_id' => 'update', 'permission_name' => 'Update', 'sort_order' => 1.101],
 
            ['module_name' => 'General Group', 'form_name' => 'Currency', 'route' => 'currency', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Currency', 'route' => 'currency', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Currency', 'route' => 'currency', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Currency', 'route' => 'currency', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Salesman', 'route' => 'salesman', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Salesman', 'route' => 'salesman', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Salesman', 'route' => 'salesman', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Salesman', 'route' => 'salesman', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Customer', 'route' => 'customer', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Customer', 'route' => 'customer', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Customer', 'route' => 'customer', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Customer', 'route' => 'customer', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Vendor', 'route' => 'supplier', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Vendor', 'route' => 'supplier', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Vendor', 'route' => 'supplier', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Vendor', 'route' => 'supplier', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Agent', 'route' => 'agent', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Agent', 'route' => 'agent', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Agent', 'route' => 'agent', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Agent', 'route' => 'agent', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Terms', 'route' => 'terms', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Terms', 'route' => 'terms', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Terms', 'route' => 'terms', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Terms', 'route' => 'terms', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Port', 'route' => 'port', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Port', 'route' => 'port', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Port', 'route' => 'port', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Port', 'route' => 'port', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Flag', 'route' => 'flag', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Flag', 'route' => 'flag', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Flag', 'route' => 'flag', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Flag', 'route' => 'flag', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Class', 'route' => 'class', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Class', 'route' => 'class', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Class', 'route' => 'class', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Class', 'route' => 'class', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Events', 'route' => 'event', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Events', 'route' => 'event', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Events', 'route' => 'event', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Events', 'route' => 'event', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'General Group', 'form_name' => 'Vessel', 'route' => 'vessel', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'General Group', 'form_name' => 'Vessel', 'route' => 'vessel', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'General Group', 'form_name' => 'Vessel', 'route' => 'vessel', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'General Group', 'form_name' => 'Vessel', 'route' => 'vessel', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'User Management', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'User Management', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'User Management', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'User Management', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'User Management', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'User Management', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'User Management', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'User Management', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Category', 'route' => 'category', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Category', 'route' => 'category', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Category', 'route' => 'category', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Category', 'route' => 'category', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Sub Category', 'route' => 'sub_category', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Sub Category', 'route' => 'sub_category', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Sub Category', 'route' => 'sub_category', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Sub Category', 'route' => 'sub_category', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Brand', 'route' => 'brand', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Brand', 'route' => 'brand', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Brand', 'route' => 'brand', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Brand', 'route' => 'brand', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Unit', 'route' => 'unit', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Unit', 'route' => 'unit', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Unit', 'route' => 'unit', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Unit', 'route' => 'unit', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Validity', 'route' => 'validity', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Validity', 'route' => 'validity', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Validity', 'route' => 'validity', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Validity', 'route' => 'validity', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Payment', 'route' => 'payment', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Payment', 'route' => 'payment', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Payment', 'route' => 'payment', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Payment', 'route' => 'payment', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Inventory Setup', 'form_name' => 'Warehouse', 'route' => 'warehouse', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Warehouse', 'route' => 'warehouse', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Warehouse', 'route' => 'warehouse', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Inventory Setup', 'form_name' => 'Warehouse', 'route' => 'warehouse', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Quotation', 'route' => 'quotation', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Quotation', 'route' => 'quotation', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Quotation', 'route' => 'quotation', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Quotation', 'route' => 'quotation', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Charge Order', 'route' => 'charge_order', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Charge Order', 'route' => 'charge_order', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Charge Order', 'route' => 'charge_order', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Charge Order', 'route' => 'charge_order', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Internal Job Order', 'route' => 'job_order', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Internal Job Order', 'route' => 'job_order', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Internal Job Order', 'route' => 'job_order', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Internal Job Order', 'route' => 'job_order', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Purchase Order', 'route' => 'purchase_order', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Purchase Order', 'route' => 'purchase_order', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Purchase Order', 'route' => 'purchase_order', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Purchase Order', 'route' => 'purchase_order', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Service Order', 'route' => 'service_order', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Service Order', 'route' => 'service_order', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Service Order', 'route' => 'service_order', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Service Order', 'route' => 'service_order', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Shipment', 'route' => 'shipment', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Sale Management', 'form_name' => 'Sale Invoice', 'route' => 'sale_invoice', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Sale Management', 'form_name' => 'Sale Invoice', 'route' => 'sale_invoice', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Sale Management', 'form_name' => 'Sale Invoice', 'route' => 'sale_invoice', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Sale Management', 'form_name' => 'Sale Invoice', 'route' => 'sale_invoice', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Warehousing', 'form_name' => 'Picklist', 'route' => 'picklist', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Warehousing', 'form_name' => 'Picklist', 'route' => 'picklist', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Warehousing', 'form_name' => 'Picklist', 'route' => 'picklist', 'permission_id' => 'receive', 'permission_name' => 'Receive', 'sort_order' => 1.103],

            ['module_name' => 'Warehousing', 'form_name' => 'Servicelist', 'route' => 'servicelist', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Warehousing', 'form_name' => 'Servicelist', 'route' => 'servicelist', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Warehousing', 'form_name' => 'Servicelist', 'route' => 'servicelist', 'permission_id' => 'receive', 'permission_name' => 'Receive', 'sort_order' => 1.103],

            ['module_name' => 'Warehousing', 'form_name' => 'Goods Received Note', 'route' => 'good_received_note', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Warehousing', 'form_name' => 'Goods Received Note', 'route' => 'good_received_note', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Warehousing', 'form_name' => 'Goods Received Note', 'route' => 'good_received_note', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Warehousing', 'form_name' => 'Goods Received Note', 'route' => 'good_received_note', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'Accounting', 'form_name' => 'Purchase Invoice', 'route' => 'purchase_invoice', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'Accounting', 'form_name' => 'Purchase Invoice', 'route' => 'purchase_invoice', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['module_name' => 'Accounting', 'form_name' => 'Purchase Invoice', 'route' => 'purchase_invoice', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['module_name' => 'Accounting', 'form_name' => 'Purchase Invoice', 'route' => 'purchase_invoice', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],

            ['module_name' => 'System', 'form_name' => 'Audit', 'route' => 'audit', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['module_name' => 'System', 'form_name' => 'Audit', 'route' => 'audit', 'permission_id' => 'view', 'permission_name' => 'View', 'sort_order' => 1.102],

        ];
        ControlAccess::insert($data);
    }
}
