<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('order_no', 40)->notNullable();
	        $table->integer('document_no')->default(0);
            $table->date('order_date')->nullable();
            $table->string('first_name', 255)->nullable();
            $table->string('last_name', 255)->nullable();
            $table->string('full_name', 255)->nullable();
            $table->string('organization', 255)->nullable();
            $table->integer('country_id')->nullable();
            $table->string('phone_no', 255)->nullable();
            $table->string('postal_code', 255)->nullable();
            $table->text('address')->nullable();
            $table->decimal('total_amount', 10, 0)->default(0);
            $table->date('delivery_date')->nullable();
            $table->text('remarks')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->char('cancelled_by', 40)->nullable();
            $table->enum('status', ['Pending', 'In Progress', 'Shipped','Cancelled'])->default('Pending');
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->char('created_by', 40)->notNullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->char('updated_by', 40)->notNullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order');
    }
};
