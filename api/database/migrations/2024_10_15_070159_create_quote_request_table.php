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
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('document_no', 40)->nullable();
            $table->date('document_date')->nullable();
            $table->tinyInteger('request_type')->default(1);
            $table->string('name', 255)->nullable();
            $table->string('house', 255)->nullable();
            $table->string('road', 255)->nullable();
            $table->string('town', 255)->nullable();
            $table->string('county_id', 255)->nullable();
            $table->char('country_id', 40)->nullable();
            $table->string('postcode', 255)->nullable();
            $table->string('phone_no', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->char('parlour_style_id', 40)->nullable();
            $table->char('rotary_style_id', 40)->nullable();
            $table->char('no_of_milking_units', 40)->nullable();
            $table->integer('no_of_cow_stalls')->nullable();
            $table->char('cow_standing_id', 40)->nullable();
            $table->char('type_of_cow_id', 40)->nullable();
            $table->integer('no_of_cows')->nullable();
            $table->char('electricity_id', 40)->nullable();
            $table->tinyInteger('express_fit')->default(1);
            $table->char('installation_id', 40)->nullable();
            $table->char('delivery_id', 40)->nullable();
            $table->date('est_delivery_date')->nullable();
            $table->char('rotary_deck_id', 40)->nullable();
            $table->char('bail_type_id', 40)->nullable();
            $table->tinyInteger('pace_entrance')->default(0);
            $table->char('pace_entrance_system_id', 40)->nullable();
            $table->char('retention_arm_id', 40)->nullable();
            $table->char('rotary_pro_floor_id', 40)->nullable();
            $table->tinyInteger('in_parlour_feeding')->default(0);
            $table->char('rotation_id', 40)->nullable();
            $table->char('rail_ramp_id', 40)->nullable();
            $table->char('outer_nib_id', 40)->nullable();
            $table->char('inner_nib_id', 40)->nullable();
            $table->char('pro_floor_id', 40)->nullable();
            $table->char('rump_rail_id', 40)->nullable();
            $table->char('front_guide_rail_id', 40)->nullable();
            $table->char('back_guide_rail_id', 40)->nullable();
            $table->char('front_exit_gate_id', 40)->nullable();
            $table->char('back_entrance_gate_id', 40)->nullable();
            $table->char('gate_control_id', 40)->nullable();
            $table->char('pit_kerb_rail_id', 40)->nullable();
            $table->char('stalling_id', 40)->nullable();
            $table->char('stalling_extra_id', 40)->nullable();
            $table->string('parlour_stall_extras', 255)->nullable();
            $table->char('herringbone_vacuum_line_id', 40)->nullable();
            $table->char('rotary_vacuum_line_id', 40)->nullable();
            $table->char('vacuum_outfit_id', 40)->nullable();
            $table->char('pump_type_id', 40)->nullable();
            $table->tinyInteger('motors')->default(0);
            $table->tinyInteger('vdrive_system')->default(0);
            $table->char('pulsation_system_id', 40)->nullable();
            $table->char('pulsation_type_id', 40)->nullable();
            $table->tinyInteger('fresh_air_line')->default(0);
            $table->char('cluster_unit_id', 40)->nullable();
            $table->char('herringbone_cluster_support_id', 40)->nullable();
            $table->char('rotary_cluster_support_id', 40)->nullable();
            $table->char('delivery_milk_pump_id', 40)->nullable();
            $table->tinyInteger('mdrive_system')->default(0);
            $table->tinyInteger('delivery_receiving_vessel')->default(0);
            $table->tinyInteger('sanitary_vessel')->default(0);
            $table->tinyInteger('milk_wash_line')->default(0);
            $table->enum('inline_filters', ['Reusable Filter', 'Standard Filter'])->nullable();
            $table->integer('qty')->nullable();
            $table->tinyInteger('airforce_air_purge')->default(0);
            $table->char('plate_cooler_id', 40)->nullable();
            $table->tinyInteger('plate_cooler_solenoid')->default(0);
            $table->char('bulk_tank_filling_id', 40)->nullable();
            $table->tinyInteger('divert_line')->default(0);
            $table->char('diversion_milk_pump_id', 40)->nullable();
            $table->tinyInteger('diversion_receiving_vessel')->default(0);
            $table->tinyInteger('easy_milk_line')->default(0);
            $table->char('rotary_easy_start_id', 40)->nullable();
            $table->char('bucket_assembly_id', 40)->nullable();
            $table->char('bucket_qty_id', 40)->nullable();
            $table->char('unit_control_id', 40)->nullable();
            $table->char('milk_sensor_id', 40)->nullable();
            $table->char('sampling_device_id', 40)->nullable();
            $table->char('herringbone_easy_start_id', 40)->nullable();
            $table->char('parlour_identification_id', 40)->nullable();
            $table->char('transponder_type_id', 40)->nullable();
            $table->tinyInteger('touch_screen')->default(0);
            $table->tinyInteger('voice_assist')->default(0);
            $table->string('vision_herd_management_extras', 255)->nullable();
            $table->char('cip_id', 40)->nullable();
            $table->tinyInteger('daytona_wash')->default(0);
            $table->char('chemical_pump_id', 40)->nullable();
            $table->char('system_id', 40)->nullable();
            $table->tinyInteger('water_boiler')->default(0);
            $table->tinyInteger('water_heater')->default(0);
            $table->char('rota_clean_wash_boom_id', 40)->nullable();
            $table->tinyInteger('rotary_platform_brush')->default(0);
            $table->char('herringbone_parlour_wash_drop_id', 40)->nullable();
            $table->char('rotary_parlour_wash_drop_id', 40)->nullable();
            $table->tinyInteger('wash_boom')->default(0);
            $table->tinyInteger('skirt_wash_brush')->default(0);
            $table->char('wash_pump_unit_id', 40)->nullable();
            $table->char('animal_handling_id', 40)->nullable();
            $table->char('crowd_gate_id', 40)->nullable();
            $table->float('width')->nullable();
            $table->float('length')->nullable();
            $table->tinyInteger('airstream_cluster_flush')->default(0);
            $table->char('herd_teat_spray_id', 40)->nullable();
            $table->char('animal_teat_spray_id', 40)->nullable();
            $table->char('udder_washer_id', 40)->nullable();
            $table->char('smart_collar_type_id', 40)->nullable();
            $table->tinyInteger('base_station')->default(0);
            $table->char('extender_unit_id', 40)->nullable();
            $table->tinyInteger('nedap_now')->default(0);
            $table->char('feed_unit_id', 40)->nullable();
            $table->tinyInteger('feed_hooper')->default(0);
            $table->char('feed_type_id', 40)->nullable();
            $table->char('feed_control_id', 40)->nullable();
            $table->tinyInteger('extra_long_auger')->default(0);
            $table->char('feeding_trough_id', 40)->nullable();
            $table->tinyInteger('feed_system_protection_rails')->default(0);
            $table->char('in_parlour_feed_control_id', 40)->nullable();
            $table->char('leg_divider_id', 40)->nullable();
            $table->tinyInteger('flex_auger_system')->default(0);
            $table->tinyInteger('drop_box_assembly')->default(0);
            $table->enum('status', ['Draft', 'Submitted', 'Under Review', 'Processed', 'Expired'])->default('Draft');
            $table->char('assignee', 40)->nullable();
            $table->char('submitted_by', 40)->nullable();
            $table->date('submitted_date')->nullable();
            $table->text('comments')->nullable();
            $table->string('final_quote', 255)->nullable();
            $table->string('final_quote_path', 255)->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();
            $table->char('created_by', 40)->nullable();
            $table->char('updated_by', 40)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quote_request');
    }
};
