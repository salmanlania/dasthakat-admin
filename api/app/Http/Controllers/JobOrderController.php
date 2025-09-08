<?php

namespace App\Http\Controllers;

use App\Jobs\Job;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\JobOrderDetailCertificate;
use App\Models\Product;
use App\Models\ShipmentDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JobOrderController extends Controller
{
	protected $document_type_id = 45;
	protected $db;

	public function index(Request $request)
	{
		$document_identity = $request->input('document_identity', '');
		$event_id = $request->input('event_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$customer_id = $request->input('customer_id', '');
		$flag_id = $request->input('flag_id', '');
		$agent_id = $request->input('agent_id', '');
		$salesman_id = $request->input('salesman_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		$details = $request->input('details', '');
		$imo = $request->input('imo', '');
		$sales_team_ids = $request->input('sales_team_ids', []);
		$search = $request->input('search', '');
		$page =  $request->input('page', 1);
		$perPage =  $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'job_order.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		$data = JobOrder::LeftJoin('event as e', 'e.event_id', '=', 'job_order.event_id')
			->LeftJoin('flag as f', 'f.flag_id', '=', 'job_order.flag_id')
			->LeftJoin('customer as c', 'c.customer_id', '=', 'job_order.customer_id')
			->LeftJoin('class as c1', 'c1.class_id', '=', 'job_order.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', '=', 'job_order.class2_id')
			->LeftJoin('vessel as v', 'v.vessel_id', '=', 'job_order.vessel_id')
			->LeftJoin('agent as a', 'a.agent_id', '=', 'job_order.agent_id')
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'job_order.salesman_id')
			->LeftJoin('sales_team as st', 'st.sales_team_id', '=', 'e.sales_team_id');
		$data = $data->where('job_order.company_id', '=', $request->company_id);
		$data = $data->where('job_order.company_branch_id', '=', $request->company_branch_id);
		if (!empty($document_identity)) $data = $data->where('job_order.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($event_id)) $data = $data->where('job_order.event_id', '=',  $event_id);
		if (!empty($flag_id)) $data = $data->where('job_order.flag_id', '=',  $flag_id);
		if (!empty($vessel_id)) $data = $data->where('job_order.vessel_id', '=',  $vessel_id);
		if (!empty($agent_id)) $data = $data->where('job_order.agent_id', '=',  $agent_id);
		if (!empty($salesman_id)) $data = $data->where('job_order.salesman_id', '=',  $salesman_id);
		if (!empty($customer_id)) $data = $data->where('job_order.customer_id', '=',  $customer_id);
		if (!empty($imo)) $data = $data->where('v.imo', 'like',  "%" . $imo . "%");
		if (!empty($class1_id)) $data = $data->where('job_order.class1_id', '=',  $class1_id);
		if (!empty($class2_id)) $data = $data->where('job_order.class2_id', '=',  $class2_id);
		if (!empty($document_identity)) $data = $data->where('job_order.document_identity', 'like', '%' . $document_identity . '%');
		if (!empty($document_date)) $data = $data->where('job_order.document_date', '=',  $document_date);
		if (!empty($sales_team_ids) && is_array($sales_team_ids)) {
			$data = $data->whereIn('e.sales_team_id', $sales_team_ids);
		}

		if (!empty($search)) {
			$search = strtolower($search);
			$data = $data->where(function ($query) use ($search) {
				$query
					->OrWhere('job_order.document_identity', 'like', '%' . $search . '%')
					->OrWhere('v.imo', 'like', '%' . $search . '%')
					->OrWhere('f.name', 'like', '%' . $search . '%')
					->OrWhere('c1.name', 'like', '%' . $search . '%')
					->OrWhere('c2.name', 'like', '%' . $search . '%')
					->OrWhere('c.name', 'like', '%' . $search . '%')
					->OrWhere('e.event_code', 'like', '%' . $search . '%')
					->OrWhere('a.name', 'like', '%' . $search . '%')
					->OrWhere('s.name', 'like', '%' . $search . '%')
					->OrWhere('st.name', 'like', '%' . $search . '%')
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('job_order.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select(
			"job_order.*",
			"c.name as customer_name",
			"e.event_code",
			"v.name as vessel_name",
			"v.imo",
			"a.name as agent_name",
			"s.name as salesman_name",
			"f.name as flag_name",
			"c1.name as class1_name",
			"c2.name as class2_name",
			"e.sales_team_id",
			"st.name as sales_team_name"
		);
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);






		return response()->json($data);
	}

	public function show($id, Request $request)
	{
		$data = JobOrder::with(
			"job_order_detail.charge_order",
			"job_order_detail.charge_order_detail",
			"job_order_detail.service_order",
			"job_order_detail.product",
			"job_order_detail.product_type",
			"job_order_detail.unit",
			"job_order_detail.supplier",
			"scheduling",
			"scheduling.port",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"salesman",
			"agent",
			"certificates"
		)->where('job_order_id', $id)->first();

		if ($data) {

			$details = $data->job_order_detail->filter(function ($detail) {
				return $detail->is_deleted == 0;
			})->sort(function ($a, $b) {
				$docA = $a->charge_order->document_identity ?? '';
				$docB = $b->charge_order->document_identity ?? '';

				$compareDoc = strcmp($docA, $docB);
				if ($compareDoc !== 0) {
					return $compareDoc;
				}

				return ($a->charge_order_detail->sort_order ?? 0) <=> ($b->charge_order_detail->sort_order ?? 0);
			})->values();

			unset($data->job_order_detail);
			$data->job_order_detail = $details;

			foreach ($data->job_order_detail as &$detail) {
				$shippedRow = ShipmentDetail::with("shipment")
					->where('charge_order_detail_id', $detail->charge_order_detail_id)
					->where('charge_order_id', $detail->charge_order_id)
					->first();

				$statusdata = $this->getStatusWithDate($detail);
				$detail->status = $statusdata['status'];
				$detail->status_date = $statusdata['date'];
				$detail->shipment = $shippedRow?->shipment ?: null;
			}
		}

		return $this->jsonResponse($data, 200, "Job Order Data");
	}



	public function Validator($request, $id = null)
	{
		$rules = [
			'event_id' => ['required'],
		];

		$msg = validateRequest($request, $rules);
		if (!empty($msg)) return $msg;
	}


	public function store(Request $request)
	{
		// Check permissions
		if (!isPermission('add', 'job_order', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		$isError = $this->Validator($request->all());
		if (!empty($isError)) {
			return $this->jsonResponse($isError, 400, "Request Failed!");
		}

		DB::beginTransaction(); // Start transaction
		try {
			// Generate UUID and document data
			$jobOrderId = $this->get_uuid();
			$document = DocumentType::getNextDocument($this->document_type_id, $request);

			// Create job order

			// Process charge order details
			$details = $request->input('details', []);
			if (empty($details)) return $this->jsonResponse('No Items Found For Job Order', 404, "No Data Found!");

			$this->createJobOrder($request, $jobOrderId, $document);
			$this->createJobOrderDetails($request, $jobOrderId, $details);
			DB::commit();
			return $this->jsonResponse(['job_order_id' => $jobOrderId], 200, 'Job Order Created Successfully!');
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Internal Job Order Store Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while saving Internal Job Order.", 500, "Transaction Failed");
		}
	}

	private function createJobOrder(Request $request, string $jobOrderId, array $document): JobOrder
	{
		return JobOrder::create([
			'company_id' => $request->company_id ?? '',
			'company_branch_id' => $request->company_branch_id ?? '',
			'job_order_id' => $jobOrderId,
			'document_type_id' => $document['document_type_id'] ?? '',
			'document_no' => $document['document_no'] ?? '',
			'document_identity' => $document['document_identity'] ?? '',
			'document_prefix' => $document['document_prefix'] ?? '',
			'document_date' => $request->document_date ?? '',
			'salesman_id' => $request->salesman_id ?? '',
			'customer_id' => $request->customer_id ?? '',
			'event_id' => $request->event_id ?? '',
			'vessel_id' => $request->vessel_id ?? '',
			'flag_id' => $request->flag_id ?? '',
			'class1_id' => $request->class1_id ?? '',
			'class2_id' => $request->class2_id ?? '',
			'agent_id' => $request->agent_id ?? '',
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		]);
	}


	/**
	 * Process charge order details
	 */
	private function createJobOrderDetails(Request $request, string $jobOrderId, array $details): void
	{
		foreach ($details as $key => $detail) {
			$chargeOrderDetail = ChargeOrderDetail::with('product_type')->where('charge_order_detail_id', $detail['charge_order_detail_id'])->first();
			$detailId = $this->get_uuid();
			$chargeOrderDetail['sort_order'] = $key + 1;
			JobOrderDetail::create(
				$this->prepareJobOrderDetailData($request, $jobOrderId, $detailId, $chargeOrderDetail)
			);

			if ($chargeOrderDetail['product_type']['product_type_id'] == 1 || $chargeOrderDetail['product_type']['product_type_id'] == 3) {
				$this->createCertificate($jobOrderId, $detailId, $chargeOrderDetail, $request->login_user_id);
			}

			$this->updateChargeOrderDetail($chargeOrderDetail, $jobOrderId, $detailId);
		}
	}
	/**
	 * Prepare job order detail data
	 */
	private function prepareJobOrderDetailData(Request $request, string $jobOrderId, string $detailId, $detail): array
	{
		return [
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'job_order_id' => $jobOrderId,
			'job_order_detail_id' => $detailId,
			'sort_order' => $detail->sort_order,
			'charge_order_id' => $detail['charge_order_id'] ?? null,
			'charge_order_detail_id' => $detail['charge_order_detail_id'] ?? null,
			'product_id' => $detail['product_id'] ?? null,
			'product_name' => $detail['product_name'] ?? null,
			'product_description' => $detail['product_description'] ?? null,
			'internal_notes' => $detail['internal_notes'] ?? null,
			'description' => $detail['description'] ?? null,
			'status' => $detail['status'] ?? null,
			'product_type_id' => $detail['product_type_id'] ?? null,
			'unit_id' => $detail['unit_id'] ?? null,
			'supplier_id' => $detail['supplier_id'] ?? null,
			'quantity' => $detail['quantity'] ?? null,
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];
	}

	/**
	 * Create certificate for service-type products
	 */
	private function createCertificate(string $jobOrderId, string $detailId, $detail, string $userId): void
	{
		$Product = Product::with('category')->where('product_id', $detail['product_id'])->first();
		$Category = $Product->category->name ?? '';
		$certificateData = [
			'certificate_id' => $this->get_uuid(),
			'job_order_id' => $jobOrderId,
			'job_order_detail_id' => $detailId,
			'type' => $Category,
			'certificate_date' => Carbon::now(),
			'created_at' => Carbon::now(),
			'created_by' => $userId,
		];

		$certificateConfig = [
			'LSA/FFE' => ['prefix' => 'GMSH', 'type' => 'LSA/FFE'],
			'Calibration' => ['prefix' => 'GMSHC', 'type' => 'Calibration'],
			'LB' => ['prefix' => 'GMSHL', 'type' => 'LB'],
		];

		if (isset($certificateConfig[$Category])) {
			$config = $certificateConfig[$Category];
			$lastCertificate = JobOrderDetailCertificate::where('type', $config['type'])
				->orderBy('sort_order', 'desc')
				->first();

			$certificateData['sort_order'] = ($lastCertificate->sort_order ?? 0) + 1;
			$certificateData['certificate_number'] = sprintf(
				'%s/%d/%s',
				$config['prefix'],
				$certificateData['sort_order'],
				Carbon::now()->format('m/Y')
			);
			if (!JobOrderDetailCertificate::where('job_order_id', $jobOrderId)->where('type', $Category)->exists()) {
				JobOrderDetailCertificate::create($certificateData);
			}
		}
	}
	public function generateCertificate(Request $request, $id)
	{
		DB::beginTransaction();
		try {
			$Certificate = $request->input('certificate', []);
			foreach ($Certificate as $key => $value) {
				$certificateData = [
					'certificate_id' => $this->get_uuid(),
					'job_order_id' => $id,
					'job_order_detail_id' => "",
					'type' => $value['type'],
					'certificate_date' => Carbon::now(),
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];

				$certificateConfig = [
					'LSA/FFE' => ['prefix' => 'GMSH', 'type' => 'LSA/FFE'],
					'Calibration' => ['prefix' => 'GMSHC', 'type' => 'Calibration'],
					'LB' => ['prefix' => 'GMSHL', 'type' => 'LB'],
				];

				if (isset($certificateConfig[$value['type']])) {
					$config = $certificateConfig[$value['type']];
					$lastCertificate = JobOrderDetailCertificate::where('type', $config['type'])
						->orderBy('sort_order', 'desc')
						->first();

					$certificateData['sort_order'] = ($lastCertificate->sort_order ?? 0) + 1;
					$certificateData['certificate_number'] = sprintf(
						'%s/%d/%s',
						$config['prefix'],
						$certificateData['sort_order'],
						Carbon::now()->format('m/Y')
					);
					if (!JobOrderDetailCertificate::where('job_order_id', $id)->where('type', $value['type'])->exists()) {
						JobOrderDetailCertificate::create($certificateData);
					}
				}
			}

			DB::commit();
			return $this->jsonResponse(['job_order_id' => $id], 200, "Update Job Order Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Internal Job Order Create Certificate Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while creating Internal Job Order Certificate.", 500, "Transaction Failed");
		}
	}

	/**
	 * Update charge order detail with job order references
	 */
	private function updateChargeOrderDetail($detail, string $jobOrderId, string $detailId): void
	{
		if ($detail['charge_order_detail_id']) {
			$detail->update([
				'job_order_id' => $jobOrderId,
				'job_order_detail_id' => $detailId
			]);
		}
	}





	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'job_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->Validator($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");
		DB::beginTransaction();

		try {
			$data  = JobOrder::where('job_order_id', $id)->first();
			$data->company_id = $request->company_id;
			$data->company_branch_id = $request->company_branch_id;
			$data->document_date = $request->document_date;
			$data->customer_id = $request->customer_id;
			$data->event_id = $request->event_id;
			$data->vessel_id = $request->vessel_id;
			$data->flag_id = $request->flag_id;
			$data->class1_id = $request->class1_id;
			$data->class2_id = $request->class2_id;
			$data->salesman_id = $request->salesman_id;
			$data->agent_id = $request->agent_id;
			$data->updated_at = date('Y-m-d H:i:s');
			$data->updated_by = $request->login_user_id;
			$data->update();



			foreach ($request->details as $detail) {
				$detail = JobOrderDetail::where('job_order_detail_id', $detail['job_order_detail_id'])->first();
				$this->createCertificate($id, $detail['job_order_detail_id'], $detail, $request->login_user_id);
			}
			DB::commit();
			return $this->jsonResponse(['job_order_id' => $id], 200, "Update Job Order Successfully!");
		} catch (\Exception $e) {
			DB::rollBack(); // Rollback on error
			Log::error('Internal Job Order Update Error: ' . $e->getMessage());
			return $this->jsonResponse("Something went wrong while updating Internal Job Order.", 500, "Transaction Failed");
		}
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'job_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		$data  = JobOrder::where('job_order_id', $id)->first();
		if (!$data) return $this->jsonResponse(['job_order_id' => $id], 404, "Job Order Not Found!");


		$jobOrderDetailIds = JobOrderDetail::where('job_order_id', $id)->pluck('job_order_detail_id');

		ChargeOrderDetail::whereIn('job_order_detail_id', $jobOrderDetailIds)
			->update([
				'job_order_id' => null,
				'job_order_detail_id' => null,
			]);

		$data->delete();
		JobOrderDetail::where('job_order_id', $id)->delete();
		JobOrderDetailCertificate::where('job_order_id', $id)->delete();

		return $this->jsonResponse(['job_order_id' => $id], 200, "Delete Job Order Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'job_order', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->job_order_ids) && !empty($request->job_order_ids) && is_array($request->job_order_ids)) {
				foreach ($request->job_order_ids as $job_order_id) {
					$user = JobOrder::where(['job_order_id' => $job_order_id])->first();
					$jobOrderDetailIds = JobOrderDetail::where('job_order_id', $job_order_id)->pluck('job_order_detail_id');

					ChargeOrderDetail::whereIn('job_order_detail_id', $jobOrderDetailIds)
						->update([
							'job_order_id' => null,
							'job_order_detail_id' => null,
						]);

					$user->delete();
					JobOrderDetail::where('job_order_id', $job_order_id)->delete();
					JobOrderDetailCertificate::where('job_order_id', $job_order_id)->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Job Order successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
