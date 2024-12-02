<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{


	protected $primaryKey = 'id';
	public $incrementing = false;
	protected $table = 'quote_request';


	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	 
	protected $tabName = [
		'1'=>'Details',
		'2'=>'Stall Work',
		'3'=>'Equipment',
		'4'=>'Milk Delivery',
		'5'=>'Automation',
		'6'=>'Washing',
		'7'=>'Herd Management',
		'8'=>'Feeding',
		'9'=>'Submit'
	];
	protected $fillable = [
		'id',
		'document_no',
		'document_date',
		'request_type',
		'name',
		'email',
		'house',
		'road',
		'town',
		'county_id',
		'country_id',
		'postcode',
		'phone_no',
		'email',
		'parlour_style_id',
		'rotary_style_id',
		'no_of_milking_units',
		'no_of_cow_stalls',
		'cow_standing_id',
		'type_of_cow_id',
		'no_of_cows',
		'electricity_id',
		'express_fit',
		'installation_id',
		'delivery_id',
		'est_delivery_date',
		'rump_rail_id',
		'rotary_deck_id',
		'bail_type_id',
		'pace_entrance',
		'retention_arm_id',
		'rotary_pro_floor_id',
		'in_parlour_feeding',
		'rotation_id',
		'pace_entrance_system_id',
		'outer_nib_id',
		'inner_nib_id',
		'rail_ramp_id',
		'pro_floor_id',
		'front_guide_rail_id',
		'back_guide_rail_id',
		'front_exit_gate_id',
		'back_entrance_gate_id',
		'gate_control_id',
		'pit_kerb_rail_id',
		'stalling_id',
		'stalling_extra_id',
		'parlour_stall_extras',
		'herringbone_vacuum_line_id',
		'rotary_vacuum_line_id',
		'vacuum_outfit_id',
		'pump_type_id',
		'motors',
		'vdrive_system',
		'pulsation_system_id',
		'pulsation_type_id',
		'fresh_air_line',
		'cluster_unit_id',
		'herringbone_cluster_support_id',
		'rotary_cluster_support_id',
		'delivery_milk_pump_id',
		'mdrive_system',
		'delivery_receiving_vessel',
		'sanitary_vessel',
		'milk_wash_line',
		'inline_filters',
		'qty',
		'airforce_air_purge',
		'plate_cooler_id',
		'plate_cooler_solenoid',
		'bulk_tank_filling_id',
		'divert_line',
		'diversion_milk_pump_id',
		'diversion_receiving_vessel',
		'easy_milk_line',
		'bucket_assembly_id',
		'bucket_qty_id',
		'unit_control_id',
		'milk_sensor_id',
		'sampling_device_id',
		'herringbone_easy_start_id',
		'rotary_easy_start_id',
		'parlour_identification_id',
		'transponder_type_id',
		'touch_screen',
		'voice_assist',
		'vision_herd_management_extras',
		'cip_id',
		'daytona_wash',
		'chemical_pump_id',
		'system_id',
		'water_boiler',
		'water_heater',
		'rotary_parlour_wash_drop_id',
		'herringbone_parlour_wash_drop_id',
		'wash_boom',
		'skirt_wash_brush',
		'wash_pump_unit_id',
		'animal_handling_id',
		'rota_clean_wash_boom_id',
		'rotary_platform_brush',
		'crowd_gate_id',
		'width',
		'length',
		'airstream_cluster_flush',
		'herd_teat_spray_id',
		'animal_teat_spray_id',
		'leg_divider_id',
		'udder_washer_id',
		'smart_collar_type_id',
		'base_station',
		'extender_unit_id',
		'nedap_now',
		'feed_unit_id',
		'feed_hooper',
		'feed_type_id',
		'feed_control_id',
		'extra_long_auger',
		'feeding_trough_id', 
		'feed_system_protection_rails',
		'in_parlour_feed_control_id',
		'flex_auger_system',
		'drop_box_assembly',
		'comments',
		'final_qoute',
		'final_qoute_path',
		'status',
		'assignee',
		'submitted_by',
		'submitted_date',
		'is_deleted',
		'created_by'
	];

	public function tabWiseRules($rules, $d)
	{

		$rules = [
			'document_date' => 'required'
		];


		return $rules;
	}



	public function getColumn($modules)
	{

		$_return = "";
		$_return .= ',(select name from countries where id = country_id limit 1) as country_name';
		$_return .= ',(select name from parlour_master where id = delivery_milk_pump_id limit 1) as delivery_milk_pump_name';
		$_return .= ',(select name from parlour_master where id = diversion_milk_pump_id limit 1) as diversion_milk_pump_name';

		foreach ($modules as $key => $row) {
			$str = str_replace(' ', '_', strToLower($row['name']));
			$str = preg_replace("/s\b/", "", $str);
			$id = $str . '_id';
			$name = $str . '_name';
			if (in_array($id, $this->fillable) && $id!='country_id') {
				$_return .= ',(select name from parlour_master where id = ' . $id . ' limit 1) as ' . $name;

			}
		}

		return $_return;
	}
	
	public function getTabNames()
	{
		return $this->tabName;
	}


	public function tabWiseFilter($request)
	{
		$arrList = [];
		if (@$request->tab_no == 1) {

			$arrList = [
				'document_date' => @$request->document_date,
				'name' => @$request->name,
				'email' => @$request->email,
				'house' => @$request->house,
				'road' => @$request->road,
				'town' => @$request->town,
				'county_id' => @$request->county_id,
				'country_id' => @$request->country_id,
				'postcode' => @$request->postcode,
				'phone_no' => @$request->phone_no,	
				'no_of_milking_units' => @$request->no_of_milking_units,
				'no_of_cow_stalls' => @$request->no_of_cow_stalls,			
				'type_of_cow_id' => @$request->type_of_cow_id,
				'no_of_cows' => @$request->no_of_cows,
				'electricity_id' => @$request->electricity_id,
				'express_fit' => @$request->express_fit ?? 0,
				'installation_id' => @$request->installation_id,
				'delivery_id' => @$request->delivery_id,
				'est_delivery_date' => @$request->est_delivery_date
			];
			
			if(@$request->request_type == 2)
			   $arrList['rotary_style_id'] = @$request->rotary_style_id;
			else{
			 $arrList['parlour_style_id'] = @$request->parlour_style_id;
			 $arrList['cow_standing_id'] = @$request->cow_standing_id;
			}
			

		} else if (@$request->tab_no == 2) {

			$arrList = [
				'rump_rail_id' => @$request->rump_rail_id,
				'front_guide_rail_id' => @$request->front_guide_rail_id,
				'back_guide_rail_id' => @$request->back_guide_rail_id,
				'front_exit_gate_id' => @$request->front_exit_gate_id,
				'back_entrance_gate_id' => @$request->back_entrance_gate_id,
				'gate_control_id' => @$request->gate_control_id,
				'pit_kerb_rail_id' => @$request->pit_kerb_rail_id,
				'stalling_id' => @$request->stalling_id,
				'stalling_extra_id' => @$request->stalling_extra_id,
				'parlour_stall_extras' => isset($request->parlour_stall_extras) ? json_encode($request->parlour_stall_extras) : "",

				
			];
			
			   if(@$request->request_type == 2){
				  $arrList = ['rotary_deck_id' => @$request->rotary_deck_id,
					'bail_type_id' => @$request->bail_type_id,
					'pace_entrance' => @$request->pace_entrance,
					'retention_arm_id' => @$request->retention_arm_id,
					'rotary_pro_floor_id' => @$request->rotary_pro_floor_id,
					'in_parlour_feeding' => @$request->in_parlour_feeding,
					'rotation_id' => @$request->rotation_id ,
					'pace_entrance_system_id'=> @$request->pace_entrance_system_id ,
					'outer_nib_id'=> @$request->outer_nib_id ,
					'inner_nib_id'=> @$request->inner_nib_id ,
					'rail_ramp_id'=> @$request->rail_ramp_id ,
					'pro_floor_id'=> @$request->pro_floor_id 
					];
				}
				
			
			} else if (@$request->tab_no == 3) {
			
				$arrList = [
				'vacuum_outfit_id' => @$request->vacuum_outfit_id,
				'pump_type_id' => @$request->pump_type_id,
				'motors' => @$request->motors ?? 0,
				'vdrive_system' => @$request->vdrive_system ?? 0,
				'pulsation_system_id' => @$request->pulsation_system_id,
				'pulsation_type_id' => @$request->pulsation_type_id,
				'fresh_air_line' => @$request->fresh_air_line,
				'cluster_unit_id' => @$request->cluster_unit_id,
				'cluster_support_id' => @$request->cluster_support_id,
				];
				
				if(@$request->request_type == 2){
			                $arrList['rotary_vacuum_line_id'] = @$request->rotary_vacuum_line_id;
					$arrList['rotary_cluster_support_id'] = @$request->rotary_cluster_support_id;
					
				}else{
				        $arrList['herringbone_vacuum_line_id'] = @$request->herringbone_vacuum_line_id;
					$arrList['herringbone_cluster_support_id'] = @$request->herringbone_cluster_support_id;
				}
			
				
				

		} else if (@$request->tab_no == 4) {

			$arrList = [
				'delivery_milk_pump_id' => @$request->delivery_milk_pump_id,
				'mdrive_system' => @$request->mdrive_system ?? 0,
				'delivery_receiving_vessel' => @$request->delivery_receiving_vessel ?? 0,
				'sanitary_vessel' => @$request->sanitary_vessel ?? 0,
				'milk_wash_line' => @$request->milk_wash_line ?? 0,
				'inline_filters' => @$request->inline_filters,
				'qty' => @$request->qty,
				'airforce_air_purge' => @$request->airforce_air_purge ?? 0,
				'plate_cooler_id' => @$request->plate_cooler_id,
				'plate_cooler_solenoid' => @$request->plate_cooler_solenoid ?? 0,
				'bulk_tank_filling_id' => @$request->bulk_tank_filling_id,
				'diversion_milk_pump_id' => @$request->diversion_milk_pump_id,
				'diversion_receiving_vessel' => @$request->diversion_receiving_vessel ?? 0,
				'divert_line' => @$request->divert_line,
				'easy_milk_line' => @$request->easy_milk_line ?? 0,
				'bucket_assembly_id' => @$request->bucket_assembly_id,
				'bucket_qty_id' => @$request->bucket_qty_id,
			];

		} else if (@$request->tab_no == 5) {

			$arrList = [
				'unit_control_id' => @$request->unit_control_id,
				'milk_sensor_id' => @$request->milk_sensor_id,
				'sampling_device_id' => @$request->sampling_device_id,
				'parlour_identification_id' => @$request->parlour_identification_id,
				'transponder_type_id' => @$request->transponder_type_id,
				'touch_screen' => @$request->touch_screen,
				'voice_assist' => @$request->voice_assist,
				'vision_herd_management_extras' => isset($request->vision_herd_management_extras) ? json_encode($request->vision_herd_management_extras) : "",
			];
			
			if(@$request->request_type == 2){
			   $arrList['rotary_easy_start_id'] = @$request->rotary_easy_start_id;
			}else{
			    $arrList['herringbone_easy_start_id'] = @$request->herringbone_easy_start_id;
			}

		} else if (@$request->tab_no == 6) {

			$arrList = [
				'daytona_wash' => @$request->daytona_wash ?? 0,
				'chemical_pump_id' => @$request->chemical_pump_id,
				'system_id' => @$request->system_id,
				'water_boiler' => @$request->water_boiler ?? 0,
				'water_heater' => @$request->water_heater ?? 0,
				'parlour_wash_drop_id' => @$request->parlour_wash_drop_id,
				'wash_pump_unit_id' => @$request->wash_pump_unit_id,
				'rota_clean_wash_boom_id' => @$request->rota_clean_wash_boom_id,
				'rotary_platform_brush' => @$request->rotary_platform_brush,
			
			];
			
			if(@$request->request_type == 2){
			        $arrList['wash_boom'] = @$request->wash_boom;
		                $arrList['skirt_wash_brush'] = @$request->skirt_wash_brush;
				$arrList['rotary_parlour_wash_drop_id'] = @$request->rotary_parlour_wash_drop_id;
			}else{
			        $arrList['cip_id'] = @$request->cip_id;
				$arrList['herringbone_parlour_wash_drop_id'] = @$request->herringbone_parlour_wash_drop_id;
			}
			
			

		} else if (@$request->tab_no == 7) {

			$arrList = [
			        'animal_handling_id' => @$request->animal_handling_id,
				'crowd_gate_id' => @$request->crowd_gate_id,
				'width' => @$request->width,
				'length' => @$request->length,
				'airstream_cluster_flush' => @$request->airstream_cluster_flush ?? 0,
				'herd_teat_spray_id' => @$request->herd_teat_spray_id,
				'leg_divider_id' => @$request->leg_divider_id,
				'smart_collar_type_id' => @$request->smart_collar_type_id,
				'base_station' => @$request->base_station ?? 0,
				'extender_unit_id' => @$request->extender_unit_id,
				'nedap_now' => @$request->nedap_now ?? 0
			];
			
			if(@$request->request_type != 2){
			        $arrList['udder_washer_id'] = @$request->udder_washer_id;
		                $arrList['animal_teat_spray_id'] = @$request->animal_teat_spray_id;
			}
			
		} else if (@$request->tab_no == 8) {	
			
			$arrList = [
                               'flex_auger_system' => @$request->flex_auger_system ?? 0,
			  ];
			  
			  if(@$request->request_type == 2){
			        $arrList['feed_control_id'] = @$request->feed_control_id;
			        $arrList['feed_type_id'] = @$request->feed_type_id;
			        $arrList['feed_hooper'] = @$request->feed_hooper;
		                $arrList['extra_long_auger'] = @$request->extra_long_auger;
				$arrList['feeding_trough_id'] = @$request->feeding_trough_id;
			}else{
			   $arrList['in_parlour_feed_control_id'] = @$request->in_parlour_feed_control_id;
			   $arrList['feed_system_protection_rails'] = @$request->feed_system_protection_rails;
			   $arrList['feed_unit_id'] = @$request->feed_unit_id;
			   $arrList['drop_box_assembly'] = @$request->drop_box_assembly;
			}
				

		}
		return $arrList;
	}

}
