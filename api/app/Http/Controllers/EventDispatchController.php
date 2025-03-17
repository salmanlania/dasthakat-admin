<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChargeOrder;
use App\Models\EventDispatch;

class EventDispatchController extends Controller
{
	public function index(Request $request)
	{
		$query = EventDispatch::leftJoin('event as e', 'event_dispatch.event_id', '=', 'e.event_id')
			->leftJoin('vessel as v', 'e.vessel_id', '=', 'v.vessel_id')
			->where('e.company_id', $request->company_id)
			->where('e.company_branch_id', $request->company_branch_id);

		if ($event_date = $request->input('event_date')) {
			$query->whereDate('e.created_at', $event_date);
		}
		if ($event_id = $request->input('event_id')) {
			$query->where('e.event_id', $event_id);
		}
		if ($vessel_id = $request->input('vessel_id')) {
			$query->where('e.vessel_id', $vessel_id);
		}
		if ($technician_id = $request->input('technician_id')) {
			$query->where('event_dispatch.technician_id', $technician_id);
		}
		if ($agent_id = $request->input('agent_id')) {
			$query->where('event_dispatch.agent_id', $agent_id);
		}
		if ($search = $request->input('search')) {
			$search = strtolower($search);
			$query->where(function ($q) use ($search) {
				$q->where('v.name', 'like', "%$search%")
					->orWhere('e.event_code', 'like', "%$search%");
			});
		}

		$sortColumn = $request->input('sort_column', 'e.created_at');
		$sortDirection = $request->input('sort_direction') === 'ascend' ? 'asc' : 'desc';

		$data = $query
			->select('event_dispatch.*', 'v.name as vessel_name', 'e.event_code')
			->orderBy($sortColumn, $sortDirection)
			->paginate($request->input('limit', 10));

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
			return $this->jsonResponse('No matching records found!', 404, "Not Found");
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
