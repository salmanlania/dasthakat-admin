<?php

namespace App\Http\Controllers;

use App\Models\ChargeOrderDetail;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\JobOrderDetailCertificate;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
			->LeftJoin('salesman as s', 's.salesman_id', '=', 'job_order.salesman_id');
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
					->OrWhere('v.name', 'like', '%' . $search . '%')
					->OrWhere('job_order.document_identity', 'like', '%' . $search . '%');
			});
		}

		$data = $data->select("job_order.*", "c.name as customer_name", "e.event_code", "v.name as vessel_name", "v.imo", "a.name as agent_name", "s.name as salesman_name", "f.name as flag_name", "c1.name as class1_name", "c2.name as class2_name");
		$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);






		return response()->json($data);
	}

	public function show($id, Request $request)
	{

		$data = JobOrder::with(
			"job_order_detail",
			"job_order_detail.charge_order",
			"job_order_detail.product",
			"job_order_detail.product_type",
			"job_order_detail.unit",
			"job_order_detail.supplier",
			"event",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"salesman",
			"agent",
			"certificates",
		)->where('job_order_id', $id)->first();


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
		if (!isPermission('add', 'job_order', $request->permission_list)) {
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
		}

		// Validation Rules
		$isError = $this->Validator($request->all());
		if (!empty($isError)) {
			return $this->jsonResponse($isError, 400, "Request Failed!");
		}

		$uuid = $this->get_uuid();
		$document = DocumentType::getNextDocument($this->document_type_id, $request);
		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'job_order_id' => $uuid,
			'document_type_id' => $document['document_type_id'] ?? "",
			'document_no' => $document['document_no'] ?? "",
			'document_identity' => $document['document_identity'] ?? "",
			'document_prefix' => $document['document_prefix'] ?? "",
			'document_date' => $request->document_date ?? "",
			'salesman_id' => $request->salesman_id ?? "",
			'customer_id' => $request->customer_id ?? "",
			'event_id' => $request->event_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'flag_id' => $request->flag_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'agent_id' => $request->agent_id ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];

		// Fetch ChargeOrderDetail records, excluding those with an existing job_order_id
		$detail = ChargeOrderDetail::with([
			'charge_order',
			'charge_order.event',
			'charge_order.customer',
			'charge_order.salesman',
			'charge_order.agent',
			'charge_order.vessel',
			'charge_order.flag',
			'charge_order.class1',
			'charge_order.class2',
			'product_type',
			'product',
			'product.sub_category',
			'product',
			'unit',
			'supplier',
		])
			->whereHas('charge_order', function ($query) use ($request) {
				$query->where('event_id', $request->event_id);
			})
			->whereNull('job_order_detail_id') // Restrict to records without a job_order_id
			->get();
		if ($detail->isNotEmpty()) {
			JobOrder::create($insertArr);

			foreach ($detail as $value) {
				$detail_uuid = $this->get_uuid();
				$insert = [
					'company_id' => $request->company_id,
					'company_branch_id' => $request->company_branch_id,
					'job_order_id' => $insertArr['job_order_id'],
					'job_order_detail_id' => $detail_uuid,
					'charge_order_id' => $value['charge_order_id'] ?? "",
					'charge_order_detail_id' => $value['charge_order_detail_id'] ?? "",
					'product_id' => $value['product_id'] ?? "",
					'product_name' => $value['product_name'] ?? "",
					'product_description' => $value['product_description'] ?? "",
					'internal_notes' => $value['internal_notes'] ?? "",
					'description' => $value['description'] ?? "",
					'product_type_id' => $value['product_type_id'] ?? "",
					'unit_id' => $value['unit_id'] ?? "",
					'supplier_id' => $value['supplier_id'] ?? "",
					'quantity' => $value['quantity'] ?? "",
					'created_at' => Carbon::now(),
					'created_by' => $request->login_user_id,
				];

				JobOrderDetail::create($insert);
				if ($value['product_type_id'] == 1) { // services type
					$subCategory = $value['product']['sub_category']['name'] ?? "";
					$Certificate = [
						'certificate_id' => $this->get_uuid(),
						'job_order_id' => $insertArr['job_order_id'],
						'job_order_detail_id' => $detail_uuid,
						'type' => $subCategory,
						'certificate_date' => Carbon::now(),
						'created_at' => Carbon::now(),
						'created_by' => $request->login_user_id,
					];
					if ($subCategory == "FRS") {
						$CertificateUnique = JobOrderDetailCertificate::where('type', 'FRS')->orderBy('sort_order', 'desc')->first();

						$Certificate['sort_order'] = ($CertificateUnique['sort_order'] ?? 0) + 1;
						$Certificate['certificate_number'] = 'GMSH/' . $Certificate['sort_order'] . '/' . Carbon::now('mm/yyyy');
					}
					if ($subCategory == "Calibration") {
						$CertificateUnique = JobOrderDetailCertificate::where('type', 'Calibration')->orderBy('sort_order', 'desc')->first();

						$Certificate['sort_order'] = ($CertificateUnique['sort_order'] ?? 0) + 1;
						$Certificate['certificate_number'] = 'GMSHC/' . $Certificate['sort_order'] . '/' . Carbon::now('mm/yyyy');
					}
					if ($subCategory == "Life Boat") {
						$CertificateUnique = JobOrderDetailCertificate::where('type', 'Life Boat')->orderBy('sort_order', 'desc')->first();

						$Certificate['sort_order'] = ($CertificateUnique['sort_order'] ?? 0) + 1;
						$Certificate['certificate_number'] = 'GMSHL/' . $Certificate['sort_order'] . '/' . Carbon::now('mm/yyyy');
					}
					if ($subCategory == "FRS" || $subCategory == "Calibration" || $subCategory == "Life Boat") {
						JobOrderDetailCertificate::create($Certificate);
					}
				}
				if (!empty($value['charge_order_detail_id'])) {
					$charge_order_detail = ChargeOrderDetail::where('charge_order_detail_id', $value['charge_order_detail_id'])->first();
					$charge_order_detail->job_order_id = $insertArr['job_order_id'];
					$charge_order_detail->job_order_detail_id = $detail_uuid;
					$charge_order_detail->update();
				}
			}
		}

		return $this->jsonResponse(['job_order_id' => $uuid], 200, "Add Job Order Successfully!");
	}


	// public function store(Request $request)
	// {
	// 	try {
	// 		// Check permissions
	// 		if (!isPermission('add', 'job_order', $request->permission_list)) {
	// 			return $this->jsonResponse('Permission Denied!', 403, "No Permission");
	// 		}

	// 		$isError = $this->Validator($request->all());
	// 		if (!empty($isError)) {
	// 			return $this->jsonResponse($isError, 400, "Request Failed!");
	// 		}

	// 		// Generate UUID and document data
	// 		$jobOrderId = $this->get_uuid();
	// 		$document = DocumentType::getNextDocument($this->document_type_id, $request);

	// 		// Create job order
	// 		$this->createJobOrder($request, $jobOrderId, $document);

	// 		// Process charge order details
	// 		$details = $request->input('details', []);
	// 		if (!empty($details)) {
	// 			$this->createJobOrderDetails($request, $jobOrderId, $details);
	// 		}

	// 		return $this->jsonResponse(['job_order_id' => $jobOrderId], 200, 'Job Order Created Successfully!');
	// 	} catch (\Exception $e) {
	// 		return $this->jsonResponse('An error occurred', 500, $e->getMessage());
	// 	}
	// }

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
		foreach ($details as $detail) {
			$detailId = $this->get_uuid();
			JobOrderDetail::create(
				$this->prepareJobOrderDetailData($request, $jobOrderId, $detailId, $detail)
			);

			if (($detail['product_type_id'] ?? 0) == 1) {
				$this->createCertificate($jobOrderId, $detailId, $detail, $request->login_user_id);
			}

			$this->updateChargeOrderDetail($detail, $jobOrderId, $detailId);
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
			'charge_order_id' => $detail->charge_order_id ?? '',
			'charge_order_detail_id' => $detail->charge_order_detail_id ?? '',
			'product_id' => $detail->product_id ?? '',
			'product_name' => $detail->product_name ?? '',
			'product_description' => $detail->product_description ?? '',
			'internal_notes' => $detail->internal_notes ?? '',
			'description' => $detail->description ?? '',
			'status' => $detail->status ?? '',
			'product_type_id' => $detail->product_type_id ?? '',
			'unit_id' => $detail->unit_id ?? '',
			'supplier_id' => $detail->supplier_id ?? '',
			'quantity' => $detail->quantity ?? '',
			'created_at' => Carbon::now(),
			'created_by' => $request->login_user_id,
		];
	}

	/**
	 * Create certificate for service-type products
	 */
	private function createCertificate(string $jobOrderId, string $detailId, $detail, string $userId): void
	{
		$Product = Product::with('sub_category')->where('product_id', $detail->product_id)->first();
		$subCategory = $Product->sub_category->name ?? '';
		$certificateData = [
			'certificate_id' => $this->get_uuid(),
			'job_order_id' => $jobOrderId,
			'job_order_detail_id' => $detailId,
			'type' => $subCategory,
			'certificate_date' => Carbon::now(),
			'created_at' => Carbon::now(),
			'created_by' => $userId,
		];

		$certificateConfig = [
			'FRS' => ['prefix' => 'GMSH', 'type' => 'FRS'],
			'Calibration' => ['prefix' => 'GMSHC', 'type' => 'Calibration'],
			'Life Boat' => ['prefix' => 'GMSHL', 'type' => 'Life Boat'],
		];

		if (isset($certificateConfig[$subCategory])) {
			$config = $certificateConfig[$subCategory];
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

			JobOrderDetailCertificate::create($certificateData);
		}
	}

	/**
	 * Update charge order detail with job order references
	 */
	private function updateChargeOrderDetail($detail, string $jobOrderId, string $detailId): void
	{
		if ($detail->charge_order_detail_id) {
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



		foreach ($request->detail as $detail) {
			JobOrderDetail::where('job_order_detail_id', $detail['job_order_detail_id'])
				->update([
					'status' => $detail['status'],
					'updated_at' => Carbon::now()
				]);
		}

		return $this->jsonResponse(['job_order_id' => $id], 200, "Update Job Order Successfully!");
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
