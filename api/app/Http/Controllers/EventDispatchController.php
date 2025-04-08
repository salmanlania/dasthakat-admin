<?php
// Dispatch renamed as Scheduling	
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\EventDispatch;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EventDispatchController extends Controller
{
	public function index(Request $request)
	{
		$query = EventDispatch::leftJoin('event as e', 'event_dispatch.event_id', '=', 'e.event_id')
			->leftJoin('vessel as v', 'e.vessel_id', '=', 'v.vessel_id')
			->leftJoin('job_order as jo', 'jo.event_id', '=', 'e.event_id')
			->leftJoin('technician as t', 't.technician_id', '=', 'event_dispatch.technician_id')
			->leftJoin('agent as a', 'a.agent_id', '=', 'event_dispatch.agent_id')

			->where('e.company_id', $request->company_id)
			->where('e.company_branch_id', $request->company_branch_id)
			->whereExists(function ($query) {
				$query->select(DB::raw(1))
					->from('charge_order')
					->whereRaw('charge_order.event_id = e.event_id');
			});
		if ($event_date = $request->input('event_date')) {
			$query->whereDate('event_dispatch.event_date', $event_date);
		}
		$start_date = $request->input('start_date');
		$end_date =  $request->input('end_date');
		if ($start_date && $end_date) {
			$date_range = [$start_date, $end_date];
			$query->whereBetween('event_dispatch.event_date', $date_range);
		}
		if ($event_time = $request->input('event_time')) {
			$query->whereTime('event_dispatch.event_time', $event_time);
		}
		if ($event_id = $request->input('event_id')) {
			$query->where('event_dispatch.event_id', $event_id);
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

		if ($search = $request->input('search')) {
			$search = strtolower($search);
			$query->where(function ($q) use ($search) {
				$q->where('v.name', 'like', "%$search%")
					->orWhere('e.event_code', 'like', "%$search%")
					->orWhere('t.name', 'like', "%$search%")
					->orWhere('a.name', 'like', "%$search%")
				;
			});
		}

		$sortColumn = $request->input('sort_column', 'event_dispatch.event_date');
		$sortDirection = $request->input('sort_direction') === 'ascend' ? 'asc' : 'desc';


		$data = $query
			->select('event_dispatch.*', 'v.name as vessel_name', 'v.vessel_id', 'e.event_code', 'event_dispatch.technician_id', 't.name as technician_name', 'a.agent_id', 'a.name as agent_name', 'jo.job_order_id')
			->orderBy($sortColumn, $sortDirection)
			->paginate($request->input('limit', 10));
		foreach ($data as $key => $value) {

			$technicianIds = $value->technician_id;
			if (!is_array($technicianIds) || empty($technicianIds)) {
				$value->technicians = null;
			} else {
				$value->technicians = User::whereIn('user_id', $technicianIds)->get(); // user_id used in technician_id
			}
		}

		return response()->json($data);
	}

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
		if ($request->has('technician_notes')) {
			$dispatch->technician_notes = $request->technician_notes;
		}
		if ($request->has('agent_id')) {
			$dispatch->agent_id = $request->agent_id;
		}
		if ($request->has('agent_notes')) {
			$dispatch->agent_notes = $request->agent_notes;
		}
		$dispatch->save();

		return $this->jsonResponse(['event' => $id], 200, "Event and Charge Orders Updated Successfully!");
	}
}
