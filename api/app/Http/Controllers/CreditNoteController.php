<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\CreditNote;
use App\Models\DocumentType;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\PDF as DomPDF;
use Illuminate\Support\Facades\App;

class CreditNoteController extends Controller
{
	protected $document_type_id = 63;
	protected $db;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$customer_id = $request->input('customer_id', '');
		$document_date = $request->input('document_date', '');
		$sale_invoice_no = $request->input('sale_invoice_no', '');
		$credit_amount = $request->input('credit_amount', '');
		$credit_percent = $request->input('credit_percent', '');
		$remarks = $request->input('remarks', '');
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'credit_note.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = CreditNote::leftJoin('sale_invoice', 'credit_note.sale_invoice_id', '=', 'sale_invoice.sale_invoice_id')
		->leftJoin('charge_order as co', 'co.charge_order_id', '=', 'sale_invoice.charge_order_id')
			->leftJoin('event', 'co.event_id', '=', 'event.event_id')
			->leftJoin('customer', 'co.customer_id', '=', 'customer.customer_id')
			->leftJoin('vessel', 'co.vessel_id', '=', 'vessel.vessel_id');

		$data = $data->where('credit_note.company_id', '=', $request->company_id);
		$data = $data->where('credit_note.company_branch_id', '=', $request->company_branch_id);
		if (!empty($document_identity)) $data = $data->where('credit_note.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($event_id)) $data = $data->where('credit_note.event_id', '=',  $event_id);
		if (!empty($vessel_id)) $data = $data->where('vessel.vessel_id', '=', $vessel_id );
		if (!empty($customer_id)) $data = $data->where('customer.customer_id', '=', $customer_id );
		if (!empty($sale_invoice_no)) $data = $data->where('sale_invoice.document_identity', 'like', '%' . $sale_invoice_no . '%');
		if (!empty($credit_amount)) $data = $data->where('credit_note.credit_amount', 'like', '%' . $credit_amount . '%');
		if (!empty($credit_percent)) $data = $data->where('credit_note.credit_percent', 'like', '%' . $credit_percent . '%');
		if (!empty($document_date)) $data = $data->where('credit_note.document_date', 'like', '%' . $document_date . '%');
		if (!empty($remarks)) $data = $data->where('credit_note.remarks', 'like', '%' . $remarks . '%');
		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->where('credit_note.document_identity', 'like', '%' . $search . '%')
					->orWhere('sale_invoice.document_identity', 'like', '%' . $search . '%')
					->orWhere('event.event_code', 'like', '%' . $search . '%')
					->orWhere('vessel.name', 'like', '%' . $search . '%')
					->orWhere('customer.name', 'like', '%' . $search . '%')
					->orWhere('credit_note.document_date', 'like', '%' . $search . '%')
					->orWhere('credit_note.remarks', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("credit_note.*", "sale_invoice.document_identity as sale_invoice_no", DB::raw("(SELECT CONCAT(event_code, ' (', IF(status = 1, 'Active', 'Inactive'), ')') FROM event WHERE event_id = credit_note.event_id) as event_code"),'vessel.name as vessel_name','vessel.vessel_id as vessel_id','customer.name as customer_name','customer.customer_id as customer_id');
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

		return response()->json($data);
	}

	public function print($id, $jsonResponse = true){
		$data = CreditNote::with('sale_invoice',
			'sale_invoice.charge_order',
			'sale_invoice.charge_order.quotation',
			'sale_invoice.charge_order.quotation.payment',
			'sale_invoice.charge_order.vessel',
			'sale_invoice.charge_order.port',
			'event')->find($id);
		if (!$data) {
			return $this->jsonResponse(null, 404, "Credit Note not found");
		}

		$dompdf = App::make('dompdf.wrapper');
	    // return $html = view('pdf_template',$data); // this now works
	    $html = view('credit_note.temp',$data)->render(); // this now works

	    $dompdf->loadHTML($html );
	    $pdfData = $dompdf->output();
		return $base64Pdf = base64_encode($pdfData);
	    $title = 'Credit Note-'.'.pdf';
	    // return $dompdf->stream($title);
	}

	public function show($id, $jsonResponse = true)
	{
		$data = CreditNote::with('sale_invoice','event','company', 'company_branch', 'created_user', 'updated_user')->find($id);
		if ($jsonResponse) {
			return $this->jsonResponse($data, 200, "Show Data");
		} else {
			return $data;
		}
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'event_id' => 'required|string|size:36',
			'sale_invoice_id' => 'required|string|size:36',
			'credit_amount' => 'required|numeric|min:0',
			'credit_percent' => 'required|numeric|min:0',
			'remarks' => 'nullable|string',
		];


		$validator = Validator::make($request, $rules);
		if ($validator->fails()) {
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{

		if (!isPermission('add', 'credit_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");



		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);

		$insertArr = [
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'credit_note_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? '',
			'document_no' => $document['document_no'] ?? '',
			'document_prefix' => $document['document_prefix'] ?? '',
			'document_identity' => $document['document_identity'] ?? '',
			'document_date' => $request->document_date ?? Carbon::now(),
			'event_id' => $request->event_id,
			'sale_invoice_id' => $request->sale_invoice_id,
			'credit_amount' => $request->credit_amount,
			'credit_percent' => $request->credit_percent,
			'remarks' => $request->remarks,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];
		CreditNote::create($insertArr);

		return $this->jsonResponse(['credit_note_id' => $uuid], 201, "Add Credit Note Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'credit_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");


		$data  = CreditNote::where('credit_note_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->document_date  = $request->document_date ?? $data->document_date;
		$data->event_id  = $request->event_id ?? $data->event_id;
		$data->sale_invoice_id  = $request->sale_invoice_id;
		$data->credit_amount  = $request->credit_amount;
		$data->credit_percent  = $request->credit_percent;
		$data->remarks  = $request->remarks;
		$data->updated_at = Carbon::now();
		$data->updated_by = $request->login_user_id;
		$data->update();

		return $this->jsonResponse(['credit_note_id' => $id], 200, "Update Credit Note Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'credit_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$record = CreditNote::find($id);
		if (!$record) {
			return $this->jsonResponse(null, 404, "Credit note not found");
		}
		$record->delete();

		return $this->jsonResponse(['credit_note_id' => $id], 200, "Delete Flag Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'credit_note', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->id) && !empty($request->id) && is_array($request->id)) {
				foreach ($request->id as $credit_note_id) {
					$record = CreditNote::find($credit_note_id);
					if (!$record) return $this->jsonResponse(null, 404, "Credit note not found");

					$record->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Credit Note successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
