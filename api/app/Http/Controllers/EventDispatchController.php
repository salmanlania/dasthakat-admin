<?php
// Dispatch renamed as Scheduling	
namespace App\Http\Controllers;

use App\Events\Event;
use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\EventDispatch;
use App\Models\Port;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventDispatchController extends Controller
{
	public function index(Request $request)
	{
		$query = EventDispatch::leftJoin('event as e', 'event_dispatch.event_id', '=', 'e.event_id')
			->leftJoin('vessel as v', 'e.vessel_id', '=', 'v.vessel_id')
			->leftJoin('job_order as jo', 'jo.event_id', '=', 'e.event_id')
			->leftJoin('agent as a', 'a.agent_id', '=', 'event_dispatch.agent_id')
			->where('e.company_id', $request->company_id)
			->where('e.company_branch_id', $request->company_branch_id)
			->whereExists(function ($query) {
				$query->select(DB::raw(1))
					->from('charge_order')
					->whereRaw('charge_order.event_id = e.event_id');
			});
		if (User::where('user_id', $request->login_user_id)->first()->user_type == 'technicians') {
			$query->where(function ($q) use ($request) {
				$q->orWhereJsonContains('event_dispatch.technician_id', $request->login_user_id);
			});
		}
		if ($event_date = $request->input('event_date')) {
			$query->whereDate('event_dispatch.event_date', $event_date);
		}
		$start_date = $request->input('start_date');
		$end_date = $request->input('end_date');

		if ($start_date && $end_date) {
			$query->whereBetween('event_dispatch.event_date', [$start_date, $end_date]);
		} elseif ($start_date) {
			$query->where('event_dispatch.event_date', '>=', $start_date);
		} elseif ($end_date) {
			$query->where('event_dispatch.event_date', '<=', $end_date);
		}
		if ($event_time = $request->input('event_time')) {
			$query->where('event_dispatch.event_time', $event_time);
		}
		// if ($port_id = $request->input('port_id')) {
		// 	$query->where('event_dispatch.port_id', $port_id);
		// }
		if ($event_id = $request->input('event_id')) {
			$query->where('event_dispatch.event_id', $event_id);
		}
		if ($status = $request->input('status')) {
			$query->where('event_dispatch.status', $status);
		}
		if ($vessel_id = $request->input('vessel_id')) {
			$query->where('e.vessel_id', $vessel_id);
		}
		if ($agent_id = $request->input('agent_id')) {
			$query->where('event_dispatch.agent_id', $agent_id);
		}
		if ($technician_notes = $request->input('technician_notes')) {
			$query->where('event_dispatch.technician_notes', 'like', '%' . $technician_notes . '%');
		}
		if ($agent_notes = $request->input('agent_notes')) {
			$query->where('event_dispatch.agent_notes', 'like', '%' . $agent_notes . '%');
		}
		if ($technician_ids = $request->input('technician_id')) {
			if (is_array($technician_ids)) {
				$query->where(function ($q) use ($technician_ids) {
					foreach ($technician_ids as $technician_id) {
						$q->orWhereJsonContains('event_dispatch.technician_id', $technician_id);
					}
				});
			}
		}
		if ($request->has('port_id')) {
			$query->whereExists(function ($q) use ($request) {
				$q->select(DB::raw(1))
					->from('quotation as q')
					->join('charge_order as co', 'co.ref_document_identity', '=', 'q.document_identity')
					->whereColumn('co.event_id', 'e.event_id')
					->where('q.company_id', $request->company_id)
					->where('q.company_branch_id', $request->company_branch_id)
					->where('co.port_id', $request->port_id);
			});
		}

		if ($request->has('short_code') && is_array($request->short_code)) {
			$shortCodes = $request->short_code;

			$query->whereExists(function ($q) use ($shortCodes) {
				$q->select(DB::raw(1))
					->from('charge_order_detail as cod')
					->leftJoin('product as p', 'p.product_id', '=', 'cod.product_id')
					->leftJoin('charge_order as co', 'co.charge_order_id', '=', 'cod.charge_order_id')
					->whereColumn('co.event_id', 'e.event_id')
					->where(function ($subQ) use ($shortCodes) {
						$subQ->whereIn('p.short_code', array_filter($shortCodes, fn($sc) => $sc !== 'new_supply'));

						if (in_array('new_supply', $shortCodes)) {
							$subQ->orWhere('cod.product_type_id', '!=', 1);
						}
					});
			});
		}


		if ($search = $request->input('search')) {
			$search = strtolower($search);
			$query->where(function ($q) use ($search) {
				$q->where('v.name', 'like', "%$search%")
					->orWhere('e.event_code', 'like', "%$search%")

					->orWhere('event_dispatch.status', 'like', "%$search%")
					// ->orWhere('p.name', 'like', "%$search%")
					->orWhere('a.name', 'like', "%$search%")
				;
			});
		}
		$query->groupBy('event_dispatch.event_dispatch_id');

		$sortColumn = $request->input('sort_column', 'event_dispatch.event_date');
		$sortDirection = $request->input('sort_direction') === 'ascend' ? 'asc' : 'desc';


		$query
			->select('event_dispatch.*', 'v.name as vessel_name', 'v.vessel_id', 'e.event_code', 'a.name as agent_name', 'a.agent_code', 'a.address as agent_address', 'a.city as agent_city', 'a.state as agent_state', 'a.zip_code as agent_zip_code', 'a.phone as agent_phone', 'a.office_no as agent_office_no', 'a.fax as agent_fax', 'a.email as agent_email', 'jo.job_order_id');

		if ($sortColumn === 'event_time') {
			$query->orderByRaw("STR_TO_DATE(CONCAT(event_dispatch.event_date, ' ', event_dispatch.event_time), '%Y-%m-%d %H:%i:%s') $sortDirection");
		} else {
			$query->orderBy($sortColumn, $sortDirection);
		}
		$data = $query->paginate($request->input('limit', 10));

		foreach ($data as $key => $value) {

			$detail = ChargeOrderDetail::whereHas('charge_order', function ($q) use ($value) {
				$q->where('event_id', $value->event_id);
			});

			// Get product data: short_code and type
			$productData = Product::with('category')->whereIn('product_id', $detail->pluck('product_id'))
				->get();

			$shortCodes = [];
			$nonServiceCount = 0;

			foreach ($productData as $product) {
				if ($product->product_type_id == 1) {
					if (!empty($product->short_code)) {
						$item = ['label' => $product->short_code, 'color' => ["name" => "black", "hex" => "#000000", "rgb" => "rgb(0,0,0)"]];

						if (isset($product->category)) {
							switch ($product->category->name) {
								case 'LSA/FFE':
									$item['color'] = ["name" => "green", "hex" => "#008000", "rgb" => "rgb(0,0,0)"];
									break;
								case 'Calibration':
									$item['color'] = ["name" => "blue", "hex" => "#0000FF", "rgb" => "rgb(0,0,255)"];
									break;
								case 'Lifeboat':
									$item['color'] = ["name" => "orange", "hex" => "#FFA500", "rgb" => "rgb(255, 165, 0)"];
									break;
							}
						}
						$shortCodes[] = $item;
					}
				} else {
					$nonServiceCount++;
				}
			}
			$is_other = $detail->where('product_type_id', '=', 4)->count();
			if (($nonServiceCount > 0) || ($is_other > 0)) {
				$shortCodes[] = ['label' => "New Supply", 'color' => ["name" => "purple", "hex" => "#A020F0", "rgb" => "rgb(160,32,240)"]];
			}

			$value->short_codes = $shortCodes;

			$detail = ChargeOrder::with('port')->where('event_id', $value->event_id)->get();
			// $portsData = EventDispatch::whereIn('document_identity', $detail->pluck('ref_document_identity'))->pluck('port_id')->toArray();

			$value->ports = Port::whereIn('port_id', $detail->pluck('port_id'))->get();


			$technicianIds = $value->technician_id;
			if (!is_array($technicianIds) || empty($technicianIds)) {
				$value->technicians = null;
			} else {
				$value->technicians = User::whereIn('user_id', $technicianIds)->get(); // user_id used in technician_id
			}
		}

		return response()->json($data);
	}
	// public function index(Request $request)
	// {
	// 	$sortColumn = $request->input('sort_column', 'event_dispatch.event_date');
	// 	$sortDirection = $request->input('sort_direction') === 'ascend' ? 'asc' : 'desc';

	// 	$query = EventDispatch::query()
	// 		->leftJoin('event as e', 'event_dispatch.event_id', '=', 'e.event_id')
	// 		->leftJoin('vessel as v', 'e.vessel_id', '=', 'v.vessel_id')
	// 		->leftJoin('job_order as jo', 'jo.event_id', '=', 'e.event_id')
	// 		->leftJoin('agent as a', 'a.agent_id', '=', 'event_dispatch.agent_id')
	// 		->leftJoin('charge_order as co', 'co.event_id', '=', 'e.event_id') // important join for filters
	// 		->where('e.company_id', $request->company_id)
	// 		->where('e.company_branch_id', $request->company_branch_id)
	// 		->select(
	// 			'event_dispatch.*',
	// 			'v.name as vessel_name',
	// 			'v.vessel_id',
	// 			'e.event_code',
	// 			'a.name as agent_name',
	// 			'a.agent_code',
	// 			'a.address as agent_address',
	// 			'a.city as agent_city',
	// 			'a.state as agent_state',
	// 			'a.zip_code as agent_zip_code',
	// 			'a.phone as agent_phone',
	// 			'a.office_no as agent_office_no',
	// 			'a.fax as agent_fax',
	// 			'a.email as agent_email',
	// 			'jo.job_order_id',
	// 			'co.port_id as co_port_id',
	// 			'co.agent_id as co_agent_id'
	// 		)->groupBy('event_dispatch.event_dispatch_id');

	// 	$start_date = $request->input('start_date');
	// 	$end_date = $request->input('end_date');
	// 	if ($start_date && $end_date) {
	// 		$query->whereBetween('event_dispatch.event_date', [$start_date, $end_date]);
	// 	} elseif ($start_date) {
	// 		$query->where('event_dispatch.event_date', '>=', $start_date);
	// 	} elseif ($end_date) {
	// 		$query->where('event_dispatch.event_date', '<=', $end_date);
	// 	}

	// 	if ($event_date = $request->input('event_date')) {
	// 		$query->whereDate('event_dispatch.event_date', $event_date);
	// 	}

	// 	if ($event_time = $request->input('event_time')) {
	// 		$query->where('event_dispatch.event_time', $event_time);
	// 	}

	// 	if ($status = $request->input('status')) {
	// 		$query->where('event_dispatch.status', $status);
	// 	}

	// 	if ($request->filled('event_id')) {
	// 		$query->where('co.event_id', $request->event_id);
	// 	}

	// 	if ($request->filled('vessel_id')) {
	// 		$query->where('co.vessel_id', $request->vessel_id);
	// 	}

	// 	if ($request->filled('agent_id')) {
	// 		$query->whereIn('co.agent_id', (array) $request->agent_id);
	// 	}

	// 	if ($request->filled('technician_id')) {
	// 		$technician_ids = (array) $request->technician_id;
	// 		$query->where(function ($q) use ($technician_ids) {
	// 			foreach ($technician_ids as $id) {
	// 				$q->orWhereJsonContains('event_dispatch.technician_id', $id);
	// 			}
	// 		});
	// 	}

	// 	if ($request->filled('port_id')) {
	// 		$query->whereIn('co.port_id', (array) $request->port_id);
	// 	}

	// 	$query->orderBy($sortColumn, $sortDirection)
	// 		->paginate($request->input('limit', 10));
	// }
	public function update($id, Request $request)
	{
		if (!isPermission('update', 'dispatch', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$chargeOrders = ChargeOrder::where('event_id', $id)->get();
		$dispatch = EventDispatch::where('event_id', $id)->first();

		if ($chargeOrders->isEmpty() || !$dispatch) {
			return $this->jsonResponse('No Charge Order found!', 400, "Not Found");
		}

		$oldTechnicianIds = !empty($dispatch->technician_id) ? $dispatch->technician_id : [];

		foreach ($chargeOrders as $chargeOrder) {
			if ($request->has('event_date')) {
				$chargeOrder->document_date = $request->event_date;
			}
			if ($request->has('technician_id')) {
				$chargeOrder->technician_id = $request->technician_id;
			}
			if ($request->has('technician_notes')) {
				$chargeOrder->technician_notes = $request->technician_notes;
			}
			if ($request->has('port_id')) {
				$chargeOrder->port_id = $request->port_id;
			}
			if ($request->has('agent_id')) {
				$chargeOrder->agent_id = $request->agent_id;
			}
			if ($request->has('agent_notes')) {
				$chargeOrder->agent_notes = $request->agent_notes;
			}
			$chargeOrder->save();
		}

		if ($request->has('event_date')) {
			$dispatch->event_date = $request->event_date;
		}
		if ($request->has('event_time')) {
			$dispatch->event_time = $request->event_time;
		}
		if ($request->has('technician_id')) {
			$dispatch->technician_id = $request->technician_id;
		}
		if ($request->has('port_id')) {
			$dispatch->port_id = $request->port_id;
		}
		if ($request->has('technician_notes')) {
			$dispatch->technician_notes = $request->technician_notes;
		}
		if ($request->has('agent_id')) {
			$dispatch->agent_id = $request->agent_id;
		}
		if ($request->has('agent_notes')) {
			$dispatch->agent_notes = $request->agent_notes;
		}
		if ($request->has('status')) {
			$dispatch->status = $request->status;
		}
		$dispatch->save();

			$newTechnicianIds =  !empty($request->technician_id)? $request->technician_id : [];

			$removed = array_diff($oldTechnicianIds, $newTechnicianIds);
			$added = array_diff($newTechnicianIds, $oldTechnicianIds);
			$unchanged = array_intersect($newTechnicianIds, $oldTechnicianIds);
						
			if(env("WHATSAPP_SERVICES","false") == true && $dispatch->event_date >= date('Y-m-d')){
				// Send messages to removed technicians
				if (!empty($removed)) {
					$removedTechs = User::whereIn('user_id', $removed)->get();
					foreach ($removedTechs as $tech) {
						$this->sendWhatsAppMessage($tech->phone_no, "Your schedule has been updated.");
					}
				}

				// Send messages to added technicians
				if (!empty($added)) {
					$addedTechs = User::whereIn('user_id', $added)->get();
					foreach ($addedTechs as $tech) {
						$this->sendWhatsAppMessage($tech->phone_no, "Your schedule has been updated.");
					}
				}
			
				// Notify unchanged technicians of schedule update
				if (!empty($unchanged)) {
					$unchangedTechs = User::whereIn('user_id', $unchanged)->get();
					foreach ($unchangedTechs as $tech) {
						$this->sendWhatsAppMessage($tech->phone_no, "Your schedule has been updated.");
					}
				}
			}

		return $this->jsonResponse(['event' => $id], 200, "Event and Charge Orders Updated Successfully!");
	}
	private function sendWhatsAppMessage($number, $message)
	{  
		if(!empty($number)){

			$config = Setting::where('module', 'whatsapp')->pluck('value', 'field');
			$setting = [
			'url' => @$config['whatsapp_api_url'] ? @$config['whatsapp_api_url'] : env('WHATSAPP_API_URL'),
			'token' => @$config['whatsapp_token'] ? @$config['whatsapp_token'] : env('WHATSAPP_TOKEN'),
			];
		
			$data = [
				'chatId' => $number . "@c.us",
				'message' => $message,
			];
			$this->whatsAppAPI($data, $setting);
		}
	}

}
