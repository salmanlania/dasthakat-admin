<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Quotation;
use App\Models\QuotationDetail;
use App\Models\QuotationStatus;
use App\Models\StockLedger;
use App\Models\Terms;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportsController extends Controller
{

	public function QuoteReport(Request $request)
	{
		
		if (!isPermission('show', 'quote_report', $request->permission_list))
        return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$port_id = $request->input('port_id', '');
		$customer_ref = $request->input('customer_ref', '');
		$customer_id = $request->input('customer_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$search = $request->input('search', '');
		$status = $request->input('status', '');
		$status_updated_by = $request->input('status_updated_by', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'quotation.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$latestStatusSubquery = DB::table('quotation_status as qs1')
			->select('qs1.quotation_id', 'qs1.status', 'qs1.created_by')
			->whereRaw('qs1.id = (
        SELECT qs2.id
        FROM quotation_status as qs2
        WHERE qs2.quotation_id = qs1.quotation_id order by qs2.created_at desc  limit 1
    )');


		$data = Quotation::LeftJoin('customer as c', 'c.customer_id', '=', 'quotation.customer_id')
		->leftJoin('quotation_status as qs_last', function ($join) {
			$join->on('qs_last.quotation_id', '=', 'quotation.quotation_id')
				 ->where('qs_last.status', '=', 'Sent to customer');
		})
		->LeftJoin('port as p', 'p.port_id', '=', 'quotation.port_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'quotation.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'quotation.vessel_id')
			->leftJoinSub($latestStatusSubquery, 'qs', 'qs.quotation_id', '=', 'quotation.quotation_id')
			->leftJoin('user as u', 'u.user_id', '=', 'qs.created_by');
		$data = $data->where('quotation.company_id', '=', $request->company_id);
		$data = $data->where('quotation.company_branch_id', '=', $request->company_branch_id);

		if (!empty($status_updated_by)) $data = $data->where('qs.created_by', '=',  $status_updated_by);
		if (!empty($status)) $data = $data->where('quotation.status', '=',  $status);
		if (!empty($port_id)) $data = $data->where('quotation.port_id', '=',  $port_id);
		if (!empty($customer_id)) $data = $data->where('quotation.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('quotation.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('quotation.event_id', '=',  $event_id);
		if (!empty($customer_ref)) $data = $data->where('quotation.customer_ref', 'like', '%' . $customer_ref . '%');
		if (!empty($document_identity)) $data = $data->where('quotation.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('quotation.document_date', '=',  $document_date);
		$start_date = $request->input('start_date');
		$end_date = $request->input('end_date');

		if ($start_date && $end_date) {
			$data->whereBetween('quotation.document_date', [$start_date, $end_date]);
		} elseif ($start_date) {
			$data->where('quotation.document_date', '>=', $start_date);
		} elseif ($end_date) {
			$data->where('quotation.document_date', '<=', $end_date);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.customer_ref', 'like', '%' . $search . '%')
					->OrWhere('p.name', 'like', '%' . $search . '%')
					->OrWhere('u.user_name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.status', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('quotation.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("quotation.*","qs_last.created_at as qs_date", DB::raw("CONCAT(e.event_code, ' (', CASE 
		WHEN e.status = 1 THEN 'Active' 
		ELSE 'Inactive' 
	END, ')') AS event_code"), 'u.user_name as status_updated_by', "c.name as customer_name", "v.name as vessel_name", "p.name as port_name");
		
	$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}
	public function BidResponse(Request $request)
	{
		
		if (!isPermission('show', 'bid_response', $request->permission_list))
        return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$port_id = $request->input('port_id', '');
		$customer_ref = $request->input('customer_ref', '');
		$customer_id = $request->input('customer_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$search = $request->input('search', '');
		$status = $request->input('status', '');
		$status_updated_by = $request->input('status_updated_by', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'quotation.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$latestStatusSubquery = DB::table('quotation_status as qs1')
			->select('qs1.quotation_id', 'qs1.status', 'qs1.created_by')
			->whereRaw('qs1.id = (
        SELECT qs2.id
        FROM quotation_status as qs2
        WHERE qs2.quotation_id = qs1.quotation_id order by qs2.created_at desc  limit 1
    )');


		$data = Quotation::LeftJoin('customer as c', 'c.customer_id', '=', 'quotation.customer_id')
		->leftJoin('quotation_status as qs_last', function ($join) {
			$join->on('qs_last.quotation_id', '=', 'quotation.quotation_id')
				 ->where('qs_last.status', '=', 'Sent to customer');
		})
		->LeftJoin('port as p', 'p.port_id', '=', 'quotation.port_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'quotation.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'quotation.vessel_id')
			->leftJoinSub($latestStatusSubquery, 'qs', 'qs.quotation_id', '=', 'quotation.quotation_id')
			->leftJoin('user as u', 'u.user_id', '=', 'qs.created_by');
		$data = $data->where('quotation.company_id', '=', $request->company_id);
		$data = $data->where('quotation.company_branch_id', '=', $request->company_branch_id);

		if (!empty($status_updated_by)) $data = $data->where('qs.created_by', '=',  $status_updated_by);
		if (!empty($status)) $data = $data->where('quotation.status', '=',  $status);
		if (!empty($port_id)) $data = $data->where('quotation.port_id', '=',  $port_id);
		if (!empty($customer_id)) $data = $data->where('quotation.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('quotation.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('quotation.event_id', '=',  $event_id);
		if (!empty($customer_ref)) $data = $data->where('quotation.customer_ref', 'like', '%' . $customer_ref . '%');
		if (!empty($document_identity)) $data = $data->where('quotation.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('quotation.document_date', '=',  $document_date);
		$start_date = $request->input('start_date');
		$end_date = $request->input('end_date');

		if ($start_date && $end_date) {
			$data->whereBetween('quotation.document_date', [$start_date, $end_date]);
		} elseif ($start_date) {
			$data->where('quotation.document_date', '>=', $start_date);
		} elseif ($end_date) {
			$data->where('quotation.document_date', '<=', $end_date);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.customer_ref', 'like', '%' . $search . '%')
					->OrWhere('p.name', 'like', '%' . $search . '%')
					->OrWhere('u.user_name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.status', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('quotation.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("quotation.*","qs_last.created_at as qs_date", DB::raw("CONCAT(e.event_code, ' (', CASE 
		WHEN e.status = 1 THEN 'Active' 
		ELSE 'Inactive' 
	END, ')') AS event_code"), 'u.user_name as status_updated_by', "c.name as customer_name", "v.name as vessel_name", "p.name as port_name");
		
	$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function BidSuccess(Request $request)
	{
		
		if (!isPermission('show', 'bid_success', $request->permission_list))
        return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$port_id = $request->input('port_id', '');
		$customer_ref = $request->input('customer_ref', '');
		$customer_id = $request->input('customer_id', '');
		$document_identity = $request->input('document_identity', '');
		$document_date = $request->input('document_date', '');
		$vessel_id = $request->input('vessel_id', '');
		$event_id = $request->input('event_id', '');
		$search = $request->input('search', '');
		$status = $request->input('status', '');
		$status_updated_by = $request->input('status_updated_by', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'quotation.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$latestStatusSubquery = DB::table('quotation_status as qs1')
			->select('qs1.quotation_id', 'qs1.status', 'qs1.created_by')
			->whereRaw('qs1.id = (
        SELECT qs2.id
        FROM quotation_status as qs2
        WHERE qs2.quotation_id = qs1.quotation_id order by qs2.created_at desc  limit 1
    )');


		$data = Quotation::LeftJoin('customer as c', 'c.customer_id', '=', 'quotation.customer_id')
		->leftJoin('quotation_status as qs_last', function ($join) {
			$join->on('qs_last.quotation_id', '=', 'quotation.quotation_id')
				 ->where('qs_last.status', '=', 'Sent to customer');
		})
		->LeftJoin('port as p', 'p.port_id', '=', 'quotation.port_id')
			->LeftJoin('event as e', 'e.event_id', '=', 'quotation.event_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'quotation.vessel_id')
			->leftJoinSub($latestStatusSubquery, 'qs', 'qs.quotation_id', '=', 'quotation.quotation_id')
			->leftJoin('user as u', 'u.user_id', '=', 'qs.created_by');
		$data = $data->where('quotation.company_id', '=', $request->company_id);
		$data = $data->where('quotation.company_branch_id', '=', $request->company_branch_id);

		if (!empty($status_updated_by)) $data = $data->where('qs.created_by', '=',  $status_updated_by);
		if (!empty($status)) $data = $data->where('quotation.status', '=',  $status);
		if (!empty($port_id)) $data = $data->where('quotation.port_id', '=',  $port_id);
		if (!empty($customer_id)) $data = $data->where('quotation.customer_id', '=',  $customer_id);
		if (!empty($vessel_id)) $data = $data->where('quotation.vessel_id', '=',  $vessel_id);
		if (!empty($event_id)) $data = $data->where('quotation.event_id', '=',  $event_id);
		if (!empty($customer_ref)) $data = $data->where('quotation.customer_ref', 'like', '%' . $customer_ref . '%');
		if (!empty($document_identity)) $data = $data->where('quotation.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('quotation.document_date', '=',  $document_date);
		$start_date = $request->input('start_date');
		$end_date = $request->input('end_date');

		if ($start_date && $end_date) {
			$data->whereBetween('quotation.document_date', [$start_date, $end_date]);
		} elseif ($start_date) {
			$data->where('quotation.document_date', '>=', $start_date);
		} elseif ($end_date) {
			$data->where('quotation.document_date', '<=', $end_date);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('c.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.customer_ref', 'like', '%' . $search . '%')
					->OrWhere('p.name', 'like', '%' . $search . '%')
					->OrWhere('u.user_name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('quotation.status', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('quotation.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("quotation.*","qs_last.created_at as qs_date", DB::raw("CONCAT(e.event_code, ' (', CASE 
		WHEN e.status = 1 THEN 'Active' 
		ELSE 'Inactive' 
	END, ')') AS event_code"), 'u.user_name as status_updated_by', "c.name as customer_name", "v.name as vessel_name", "p.name as port_name");
		
	$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

}
