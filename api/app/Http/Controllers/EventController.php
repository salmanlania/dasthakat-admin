<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\ChargeOrder;
use App\Models\ChargeOrderDetail;
use App\Models\CustomerCommissionAgent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Event;
use App\Models\EventDispatch;
use App\Models\GRNDetail;
use App\Models\JobOrder;
use App\Models\Picklist;
use App\Models\PicklistReceived;
use App\Models\Quotation;
use App\Models\ServicelistReceived;
use App\Models\ServiceOrder;
use App\Models\ShipmentDetail;
use App\Models\VesselCommissionAgent;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
	protected $db;

	// public function index(Request $request)
	// {
	// 	$event_code = $request->input('event_code', '');
	// 	$customer_id = $request->input('customer_id', '');
	// 	$vessel_id = $request->input('vessel_id', '');
	// 	$class1_id = $request->input('class1_id', '');
	// 	$class2_id = $request->input('class2_id', '');
	// 	$status = $request->input('status', '');
	// 	$all = $request->input('all', '');

	// 	$search = $request->input('search', '');
	// 	$page =  $request->input('page', 1);
	// 	$perPage =  $request->input('limit', 10);
	// 	$sort_column = $request->input('sort_column', 'event.created_at');
	// 	$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

	// 	$data =  Event::LeftJoin('customer as c', 'event.customer_id', 'c.customer_id')
	// 		->LeftJoin('vessel as v', 'event.vessel_id', 'v.vessel_id')
	// 		->LeftJoin('class as c1', 'c1.class_id', 'event.class1_id')
	// 		->LeftJoin('class as c2', 'c2.class_id', 'event.class2_id');
	// 	$data = $data->where('event.company_id', '=', $request->company_id);
	// 	$data = $data->where('event.company_branch_id', '=', $request->company_branch_id);



	// 	if ($all != 1) $data = $data->where('event.status', '=', 1);
	// 	if (!empty($status) || $status == '0') $data = $data->where('event.status', '=', $status);
	// 	if (!empty($event_code)) $data = $data->where('event_code', 'like', '%' . $event_code . '%');
	// 	if (!empty($customer_id)) $data = $data->where('event.customer_id', '=', $customer_id);
	// 	if (!empty($vessel_id)) $data = $data->where('event.vessel_id', '=', $vessel_id);
	// 	if (!empty($class1_id)) $data = $data->where('c1.class_id', '=', $class1_id);
	// 	if (!empty($class2_id)) $data = $data->where('c2.class_id', '=', $class2_id);


	// 	if (!empty($search)) {
	// 		$search = strtolower($search);
	// 		$data = $data->where(function ($query) use ($search) {
	// 			$query
	// 				->where('v.name', 'like', '%' . $search . '%')
	// 				->orWhere('c.name', 'like', '%' . $search . '%')
	// 				->orWhere('c1.name', 'like', '%' . $search . '%')
	// 				->orWhere('c2.name', 'like', '%' . $search . '%')
	// 				->orWhere('event.status', '=', $search)
	// 				->orWhere('event.event_code', 'like', '%' . $search . '%');
	// 		});
	// 	}

	// 	$data = $data->select(
	// 		"event.*",
	// 		DB::raw("
	//         CASE
	//             WHEN event.status IN (0, 1) THEN (
	//                 CASE
	//                     WHEN event.status = 1 THEN (
	//                         CASE
	//                             WHEN (
	//                                 -- Check if any shipments exist for the event
	//                                 SELECT COUNT(*)
	//                                 FROM shipment s
	//                                 WHERE s.event_id = event.event_id
	//                             ) = 0 THEN 1 -- No shipments exist
	//                             WHEN (
	//                                 -- Check if all charge orders have complete shipments
	//                                 SELECT COUNT(*)
	//                                 FROM charge_order co
	//                                 LEFT JOIN (
	//                                     SELECT co2.charge_order_id AS charge_order_id,
	//                                            COUNT(cod.charge_order_detail_id) AS total_details,
	//                                            SUM(CASE
	//                                                WHEN sd.quantity = cod.quantity THEN 1
	//                                                ELSE 0
	//                                            END) AS matched_details
	//                                     FROM charge_order co2
	//                                     JOIN charge_order_detail cod ON co2.charge_order_id = cod.charge_order_id
	//                                     LEFT JOIN shipment s ON s.event_id = co2.event_id
	//                                     LEFT JOIN shipment_detail sd ON s.shipment_id = sd.shipment_id
	//                                         AND sd.charge_order_id = cod.charge_order_id
	//                                         AND sd.charge_order_detail_id = cod.charge_order_detail_id
	//                                     WHERE co2.event_id = event.event_id
	//                                     GROUP BY co2.charge_order_id
	//                                     HAVING total_details = matched_details
	//                                 ) AS shipment_status ON co.charge_order_id = shipment_status.charge_order_id
	//                                 WHERE co.event_id = event.event_id
	//                                 GROUP BY co.event_id
	//                                 HAVING COUNT(co.charge_order_id) = SUM(CASE WHEN shipment_status.charge_order_id IS NOT NULL THEN 1 ELSE 0 END)
	//                             ) > 0 THEN 3 -- All charge orders have complete shipments
	//                             ELSE 2 -- Not all shipments complete
	//                         END
	//                     )
	//                     ELSE 0 -- Status is 0, keep it unchanged
	//                 END
	//             )
	//             ELSE event.status -- Keep existing status for values other than 0 or 1
	//         END AS status
	//     "),
	// 		DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
	// 		"c.name as customer_name",
	// 		"v.name as vessel_name",
	// 		"c1.name as class1_name",
	// 		"c2.name as class2_name"
	// 	);
	// 	$data =  $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

	// 	return response()->json($data);
	// }
	// attempt2
	// 	public function index(Request $request)
	// {
	//     $event_code = $request->input('event_code', '');
	//     $customer_id = $request->input('customer_id', '');
	//     $vessel_id = $request->input('vessel_id', '');
	//     $class1_id = $request->input('class1_id', '');
	//     $class2_id = $request->input('class2_id', '');
	//     $status = $request->input('status', '');
	//     $all = $request->input('all', '');
	//     $search = $request->input('search', '');
	//     $page = $request->input('page', 1);
	//     $perPage = $request->input('limit', 10);
	//     $sort_column = $request->input('sort_column', 'created_at');
	//     $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

	//     // Base query with computed status
	//     $subQuery = Event::leftJoin('customer as c', 'event.customer_id', 'c.customer_id')
	//         ->leftJoin('vessel as v', 'event.vessel_id', 'v.vessel_id')
	//         ->leftJoin('class as c1', 'c1.class_id', 'event.class1_id')
	//         ->leftJoin('class as c2', 'c2.class_id', 'event.class2_id')
	//         ->where('event.company_id', '=', $request->company_id)
	//         ->where('event.company_branch_id', '=', $request->company_branch_id)
	//         ->select(
	//             'event.*',
	//             DB::raw("
	//                 CASE
	//                     WHEN event.status IN (0, 1) THEN (
	//                         CASE
	//                             WHEN event.status = 1 THEN (
	//                                 CASE
	//                                     WHEN (
	//                                         -- Check if any shipments exist for the event
	//                                         SELECT COUNT(*)
	//                                         FROM shipment s
	//                                         WHERE s.event_id = event.event_id
	//                                     ) = 0 THEN 1 -- No shipments exist (available)
	//                                     WHEN (
	//                                         -- Check if all charge orders have complete shipments
	//                                         SELECT COUNT(*)
	//                                         FROM charge_order co
	//                                         LEFT JOIN (
	//                                             SELECT co2.charge_order_id AS charge_order_id,
	//                                                    COUNT(cod.charge_order_detail_id) AS total_details,
	//                                                    SUM(CASE
	//                                                        WHEN sd.quantity = cod.quantity THEN 1
	//                                                        ELSE 0
	//                                                    END) AS matched_details
	//                                             FROM charge_order co2
	//                                             JOIN charge_order_detail cod ON co2.charge_order_id = cod.charge_order_id
	//                                             LEFT JOIN shipment s ON s.event_id = co2.event_id
	//                                             LEFT JOIN shipment_detail sd ON s.shipment_id = sd.shipment_id
	//                                                 AND sd.charge_order_id = cod.charge_order_id
	//                                                 AND sd.charge_order_detail_id = cod.charge_order_detail_id
	//                                             WHERE co2.event_id = event.event_id
	//                                             GROUP BY co2.charge_order_id
	//                                             HAVING total_details = matched_details
	//                                         ) AS shipment_status ON co.charge_order_id = shipment_status.charge_order_id
	//                                         WHERE co.event_id = event.event_id
	//                                         GROUP BY co.event_id
	//                                         HAVING COUNT(co.charge_order_id) = SUM(CASE WHEN shipment_status.charge_order_id IS NOT NULL THEN 1 ELSE 0 END)
	//                                     ) > 0 THEN 3 -- All charge orders have complete shipments (complete)
	//                                     ELSE 2 -- Not all shipments complete (partial)
	//                                 END
	//                             )
	//                             ELSE 0 -- Status is 0, keep it unchanged (inactive)
	//                         END
	//                     )
	//                     ELSE event.status -- Keep existing status for values other than 0 or 1
	//                 END AS computed_status
	//             "),
	//             DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
	//             'c.name as customer_name',
	//             'v.name as vessel_name',
	//             'c1.name as class1_name',
	//             'c2.name as class2_name'
	//         );

	//     // Wrap the subquery to allow filtering on computed_status
	//     $data = DB::table(DB::raw("({$subQuery->toSql()}) as sub"))
	//         ->mergeBindings($subQuery->getQuery());

	//     // Apply filters
	//     if ($all != 1) {
	//         $data = $data->where('status', '=', 1); // Restrict to raw event.status = 1
	//     }
	//     if ($status !== '') { // Allow filtering on computed_status (0, 1, 2, 3)
	//         $data = $data->where('computed_status', '=', $status);
	//     }
	//     if (!empty($event_code)) {
	//         $data = $data->where('event_code', 'like', '%' . $event_code . '%');
	//     }
	//     if (!empty($customer_id)) {
	//         $data = $data->where('customer_id', '=', $customer_id);
	//     }
	//     if (!empty($vessel_id)) {
	//         $data = $data->where('vessel_id', '=', $vessel_id);
	//     }
	//     if (!empty($class1_id)) {
	//         $data = $data->where('class1_id', '=', $class1_id);
	//     }
	//     if (!empty($class2_id)) {
	//         $data = $data->where('class2_id', '=', $class2_id);
	//     }

	//     if (!empty($search)) {
	//         $search = strtolower($search);
	//         $data = $data->where(function ($query) use ($search) {
	//             $query
	//                 ->where('vessel_name', 'like', '%' . $search . '%')
	//                 ->orWhere('customer_name', 'like', '%' . $search . '%')
	//                 ->orWhere('class1_name', 'like', '%' . $search . '%')
	//                 ->orWhere('class2_name', 'like', '%' . $search . '%')
	//                 ->orWhere('computed_status', '=', $search) // Search on computed_status
	//                 ->orWhere('event_code', 'like', '%' . $search . '%');
	//         });
	//     }

	//     // Select all columns and rename computed_status to status for the response
	//     $data = $data->select(
	//         '*',
	//         DB::raw('computed_status AS status')
	//     );

	//     // Apply sorting and pagination
	//     $data = $data->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);

	//     return response()->json($data);
	// }
	// attempt3

	public function index(Request $request)
	{
		// Input validation and sanitization
		$event_code = $request->input('event_code', '');
		$customer_id = $request->input('customer_id', '');
		$vessel_id = $request->input('vessel_id', '');
		$class1_id = $request->input('class1_id', '');
		$class2_id = $request->input('class2_id', '');
		// $status = $request->input('status', '');
		$all = $request->input('all', '');

		// Additional filters for computed status
		$computed_status_filter = $request->input('status', ''); // Filter by 0,1,2,3

		$search = $request->input('search', '');
		$page = $request->input('page', 1);
		$perPage = $request->input('limit', 10);
		$sort_column = $request->input('sort_column', 'event.created_at');
		$sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

		// Validate pagination parameters
		$page = max(1, (int)$page);
		$perPage = min(100, max(1, (int)$perPage));

		// Validate sort column to prevent SQL injection
		$allowedSortColumns = [
			'event.created_at',
			'event.event_code',
			'event.status',
			'computed_status', // For computed status sorting
			'c.name',
			'v.name',
			'c1.name',
			'c2.name'
		];
		if (!in_array($sort_column, $allowedSortColumns)) {
			$sort_column = 'event.created_at';
		}

		// Determine if we need to sort by computed status
		$sortByComputedStatus = ($sort_column === 'computed_status');

		// If sorting by computed field, use a sortable field for initial query
		$actualSortColumn = $sortByComputedStatus ? 'event.status' : $sort_column;

		// Check if required company parameters exist
		if (!$request->has('company_id') || !$request->has('company_branch_id')) {
			return response()->json(['error' => 'Company ID and Branch ID are required'], 400);
		}

		try {
			// Build the base query with proper join syntax
			$data = Event::leftJoin('customer as c', 'event.customer_id', '=', 'c.customer_id')
				->leftJoin('vessel as v', 'event.vessel_id', '=', 'v.vessel_id')
				->leftJoin('class as c1', 'c1.class_id', '=', 'event.class1_id')
				->leftJoin('class as c2', 'c2.class_id', '=', 'event.class2_id');

			// Apply company filters
			$data = $data->where('event.company_id', '=', $request->company_id);
			$data = $data->where('event.company_branch_id', '=', $request->company_branch_id);

			// Apply status filters
			if ($all != 1) {
				$data = $data->where('event.status', '=', 1);
			}
			// if (!empty($status) || $status == '0') {
			// 	$data = $data->where('event.status', '=', $status);
			// }

			// Apply other filters
			if (!empty($event_code)) {
				$data = $data->where('event.event_code', 'like', '%' . $event_code . '%');
			}
			if (!empty($customer_id)) {
				$data = $data->where('event.customer_id', '=', $customer_id);
			}
			if (!empty($vessel_id)) {
				$data = $data->where('event.vessel_id', '=', $vessel_id);
			}
			if (!empty($class1_id)) {
				$data = $data->where('c1.class_id', '=', $class1_id);
			}
			if (!empty($class2_id)) {
				$data = $data->where('c2.class_id', '=', $class2_id);
			}

			// Fix search query logic
			if (!empty($search)) {
				$search = strtolower($search);
				$data = $data->where(function ($query) use ($search) {
					$query->where('v.name', 'like', '%' . $search . '%')
						->orWhere('c.name', 'like', '%' . $search . '%')
						->orWhere('c1.name', 'like', '%' . $search . '%')
						->orWhere('c2.name', 'like', '%' . $search . '%')
						->orWhere('event.status', '=', $search)
						->orWhere('event.event_code', 'like', '%' . $search . '%');
				});
			}

			// Get basic data first
			$data = $data->select(
				"event.*",
				"event.status as original_status", // Keep original for computation
				DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
				"c.name as customer_name",
				"v.name as vessel_name",
				"c1.name as class1_name",
				"c2.name as class2_name"
			);

			// Handle sorting/filtering for computed status
			if ($sortByComputedStatus || !empty($computed_status_filter)) {
				// For computed status operations, get all data first
				$allData = $data->orderBy($actualSortColumn, $sort_direction)->get();

				// Process computed status for all items
				$processedData = $allData->map(function ($item) {
					$computedStatus = $this->calculateEventStatus($item->original_status, $item->event_id);
					$item->status = $computedStatus; // Override with computed status
					$item->computed_status = $computedStatus; // For sorting/filtering
					return $item;
				});

				// Apply computed status filter
				if (!empty($computed_status_filter)) {
					$processedData = $processedData->filter(function ($item) use ($computed_status_filter) {
						return $item->computed_status == $computed_status_filter;
					});
				}

				// Sort by computed status if needed
				if ($sortByComputedStatus) {
					$processedData = $sort_direction === 'asc'
						? $processedData->sortBy('computed_status')
						: $processedData->sortByDesc('computed_status');
				}

				// Manual pagination
				$result = $this->paginateCollection($processedData, $perPage, $page, $request);
			} else {
				// Normal path - execute query with pagination first
				$result = $data->orderBy($actualSortColumn, $sort_direction)
					->paginate($perPage, ['*'], 'page', $page);

				// Process computed status only for paginated results
				$result->getCollection()->transform(function ($item) {
					$computedStatus = $this->calculateEventStatus($item->original_status, $item->event_id);
					$item->status = $computedStatus; // Override with computed status
					return $item;
				});
			}

			// Clean up temporary fields
			$result->getCollection()->transform(function ($item) {
				unset($item->original_status, $item->computed_status);
				return $item;
			});
			return json_encode($result);
		} catch (\Exception $e) {
			// Log the error for debugging
			Log::error('Error in Event index method: ' . $e->getMessage());

			return response()->json([
				'success' => false,
				'error' => 'An error occurred while fetching data'
			], 500);
		}
	}

	/**
	 * Calculate event status based on complex business logic
	 * Returns: 0 = Inactive, 1 = Active, 2 = Partial, 3 = Complete
	 */
	private function calculateEventStatus($originalStatus, $eventId)
	{
		// Handle non-active statuses
		if (!in_array($originalStatus, [0, 1])) {
			return $originalStatus; // Keep existing status for values other than 0 or 1
		}

		if ($originalStatus == 0) {
			return 0; // Inactive
		}

		// For status = 1, check shipment completeness
		// Check if any shipments exist for this event
		$hasShipments = DB::table('shipment')
			->where('event_id', $eventId)
			->exists();

		if (!$hasShipments) {
			return 1; // Active - No shipments exist
		}

		// Check if all charge orders have complete shipments
		$allChargeOrdersComplete = $this->areAllChargeOrdersComplete($eventId);

		if ($allChargeOrdersComplete === true) {
			return 3; // Complete - All charge orders have complete shipments
		} elseif ($allChargeOrdersComplete === false) {
			return 2; // Partial - Not all shipments complete
		} else {
			return 1; // Active - No charge orders or other edge cases
		}
	}

	/**
	 * Check if all charge orders for an event have complete shipments
	 * Returns: true = all complete, false = partial, null = no charge orders
	 */
	private function areAllChargeOrdersComplete($eventId)
	{
		// Get all charge orders for this event
		$chargeOrders = DB::table('charge_order')
			->where('event_id', $eventId)
			->get();

		if ($chargeOrders->isEmpty()) {
			return null; // No charge orders
		}

		$totalChargeOrders = $chargeOrders->count();
		$completeChargeOrders = 0;

		foreach ($chargeOrders as $chargeOrder) {
			if ($this->isChargeOrderComplete($chargeOrder->charge_order_id, $eventId)) {
				$completeChargeOrders++;
			}
		}

		if ($completeChargeOrders == 0) {
			return null; // No completed orders
		} elseif ($completeChargeOrders == $totalChargeOrders) {
			return true; // All complete
		} else {
			return false; // Partial
		}
	}

	/**
	 * Check if a specific charge order has complete shipments
	 */
	private function isChargeOrderComplete($chargeOrderId, $eventId)
	{
		// Get total details and matched shipment details using the same logic as original query
		$result = DB::select("
			SELECT 
				co.charge_order_id,
				COUNT(cod.charge_order_detail_id) AS total_details,
				SUM(CASE
					WHEN sd.quantity = cod.quantity THEN 1
					ELSE 0
				END) AS matched_details
			FROM charge_order co
			JOIN charge_order_detail cod ON co.charge_order_id = cod.charge_order_id
			LEFT JOIN shipment s ON s.event_id = co.event_id
			LEFT JOIN shipment_detail sd ON s.shipment_id = sd.shipment_id
				AND sd.charge_order_id = cod.charge_order_id
				AND sd.charge_order_detail_id = cod.charge_order_detail_id
			WHERE co.charge_order_id = ? AND co.event_id = ?
			GROUP BY co.charge_order_id
		", [$chargeOrderId, $eventId]);

		if (empty($result)) {
			return false;
		}

		$orderData = $result[0];
		return $orderData->total_details == $orderData->matched_details && $orderData->total_details > 0;
	}

	/**
	 * Manually paginate a collection
	 */
	private function paginateCollection($collection, $perPage, $page, $request)
	{
		$total = $collection->count();
		$offset = ($page - 1) * $perPage;
		$items = $collection->slice($offset, $perPage)->values();

		$paginator = new LengthAwarePaginator(
			$items,
			$total,
			$perPage,
			$page,
			[
				'path' => $request->url(),
				'pageName' => 'page'
			]
		);

		return $paginator;
	}


	public function getChargeOrders($id)
	{
		$chargeOrders = ChargeOrder::with([
			'event',
			'customer',
			'salesman',
			'agent',
			'vessel',
			'flag',
			'class1',
			'class2',
			'charge_order_detail',
			'charge_order_detail.product_type',
			'charge_order_detail.product',
			'charge_order_detail.unit',
			'charge_order_detail.supplier',
		])
			->where('event_id', $id)
			->orderBy('created_at', 'desc')
			->get();

		$event = Event::with([
			'customer',
			'customer.salesman',
			'vessel',
			'vessel.flag',
			'class1',
			'class2',
		])->find($id);

		if (!$event) {
			return $this->jsonResponse([], 404, "Event not found");
		}

		foreach ($chargeOrders as $chargeOrder) {
			$chargeOrder->charge_order_detail = $chargeOrder->charge_order_detail->filter(function ($detail) {
				return empty($detail->job_order_detail_id);
			});
		}

		return $this->jsonResponse([
			'charge_orders' => $chargeOrders,
			'event' => $event
		], 200, "Event Charge Orders Data");
	}
	public function EventServiceOrders($id)
	{

		$data = ServiceOrder::with(
			"service_order_detail",
			"service_order_detail.charge_order",
			"service_order_detail.charge_order_detail",
			"service_order_detail.product",
			"service_order_detail.product_type",
			"service_order_detail.unit",
			"service_order_detail.supplier",
			"scheduling",
			"event",
			"charge_order",
			"charge_order.quotation",
			"charge_order.quotation.port",
			"charge_order.agent",
			"event.vessel",
			"event.customer",
			"event.class1",
			"event.class2",
			"event.customer.salesman",
			"event.vessel.flag"
		)
			->where('event_id', $id)->get();

		return $this->jsonResponse($data, 200, "Show Data");
	}
	public function EventJobOrders($id, Request $request)
	{

		$records = JobOrder::with(
			"job_order_detail",
			"job_order_detail.charge_order",
			"job_order_detail.charge_order_detail",
			"job_order_detail.service_order",
			"job_order_detail.product",
			"job_order_detail.product_type",
			"job_order_detail.unit",
			"job_order_detail.supplier",
			"event",
			"scheduling",
			"scheduling.port",
			"vessel",
			"customer",
			"flag",
			"class1",
			"class2",
			"salesman",
			"agent",
			"certificates",
		)->where('event_id', $id)->get();

		if ($records) {
			foreach ($records as $key => &$data) {

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

					$detail->shipment = $shippedRow?->shipment ?: null;
				}
			}
		}

		return $this->jsonResponse($records, 200, "Job Order Data");
	}

	public function EventChargeOrdersWithPicklists($id)
	{
		// Fetch picklists related to the event with all necessary relationships
		$picklists = Picklist::with([
			"charge_order",
			"charge_order.vessel",
			"charge_order.event",
			"picklist_detail",
			"picklist_detail.product"
		])->whereHas('charge_order', function ($query) use ($id) {
			$query->where('event_id', $id);
		})->get();

		if ($picklists->isEmpty()) {
			return $this->jsonResponse("Picklist not found", 404, "Picklist not found");
		}

		// Fetch received picklist history for all relevant picklists
		$receivedData = PicklistReceived::with([
			"picklist_received_detail",
			"picklist_received_detail.pulled_by",
			"picklist_received_detail.product",
			"picklist_received_detail.warehouse"
		])->whereIn('picklist_id', $picklists->pluck('picklist_id'))->get();

		// Prepare response data
		$response = [];

		foreach ($picklists as $picklist) {
			$picklistDetails = [];
			$items = [];

			foreach ($picklist->picklist_detail as $detail) {
				$picklistDetailId = $detail->picklist_detail_id;

				// Get received details for this specific picklist detail item
				$receivedDetails = $receivedData->flatMap(function ($received) {
					return $received->picklist_received_detail;
				})->where('picklist_detail_id', $picklistDetailId);

				// Sum received quantity
				$totalReceivedQty = $receivedDetails->sum('quantity');

				$warehouseNames = $receivedDetails->pluck('warehouse.name')->filter()->unique()->implode(', ');
				$remarks = $receivedDetails->pluck('remarks')->filter()->unique()->implode(', ');

				// Prepare picklist detail data
				$picklistDetails[] = [
					"picklist_detail_id" => $picklistDetailId,
					"picklist_id" => $picklist->picklist_id,
					"charge_order_detail_id" => $detail->charge_order_detail_id ?? null,
					"sort_order" => $detail->sort_order ?? 0,
					"product_id" => $detail->product_id ?? null,
					"product_description" => $detail->product->impa_code . " " . $detail->product->name ?? null,
					"quantity" => $detail->quantity,
					"created_by" => $detail->created_by ?? null,
					"updated_by" => $detail->updated_by ?? null,
					"created_at" => $detail->created_at,
					"updated_at" => $detail->updated_at,
					"product" => $detail->product
				];

				// Prepare items (received details)
				$items[] = [
					"picklist_detail_id" => $picklistDetailId,
					"product" => $detail->product,
					"original_quantity" => $detail->quantity,
					"total_received_quantity" => $totalReceivedQty,
					"remarks" => $remarks ?: null,
					"warehouse" => ["name" => $warehouseNames ?: null],
				];
			}

			// Construct full picklist response object
			$response[] = [
				"picklist_id" => $picklist->picklist_id,
				"company_id" => $picklist->company_id,
				"company_branch_id" => $picklist->company_branch_id,
				"document_type_id" => $picklist->document_type_id,
				"document_no" => $picklist->document_no,
				"document_prefix" => $picklist->document_prefix,
				"document_identity" => $picklist->document_identity,
				"document_date" => $picklist->document_date,
				"charge_order_id" => $picklist->charge_order_id,
				"total_quantity" => $picklist->total_quantity,
				"created_by" => $picklist->created_by,
				"updated_by" => $picklist->updated_by,
				"created_at" => $picklist->created_at,
				"updated_at" => $picklist->updated_at,
				"charge_order" => $picklist->charge_order,
				"picklist_detail" => $picklistDetails,
				"items" => $items
			];
		}

		return $this->jsonResponse($response, 200, "Picklist Details");
	}


	public function show($id, $jsonResponse = true)
	{
		$data =  Event::with("company", "company_branch", "created_user", "updated_user")->LeftJoin('customer as c', 'event.customer_id', 'c.customer_id')
			->LeftJoin('vessel as v', 'event.vessel_id', 'v.vessel_id')
			->LeftJoin('flag as f', 'f.flag_id', 'v.flag_id')
			->LeftJoin('class as c1', 'c1.class_id', 'event.class1_id')
			->LeftJoin('class as c2', 'c2.class_id', 'event.class2_id')
			->LeftJoin('payment as p', 'p.payment_id', 'c.payment_id')
			->LeftJoin('salesman as s', 's.salesman_id', 'c.salesman_id')
			->select(
				"event.*",
				DB::raw("CONCAT(event.event_code, ' (', v.name, ')') as event_name"),
				"c.name as customer_name",
				"c.rebate_percent",
				"p.payment_id",
				"p.name as payment_name",
				"v.name as vessel_name",
				"v.imo",
				"c1.name as class1_name",
				"c2.name as class2_name",
				"f.name as flag_name",
				"f.flag_id",
				"s.salesman_id as salesman_id",
				"s.name as salesman_name",
				"s.commission_percentage",

			)
			->where('event_id', $id)->first();

		$data->vessel_commission_agent = VesselCommissionAgent::with('commission_agent')->where('vessel_id', $data->vessel_id)->orderBy('sort_order')->get();
		$data->customer_commission_agent = CustomerCommissionAgent::with('commission_agent')->where('customer_id', $data->customer_id)->orderBy('sort_order')->get();


		if ($jsonResponse) {
			return $this->jsonResponse($data, 200, "Show Data");
		} else {
			return $data;
		}
	}

	public function validateRequest($request, $id = null)
	{
		$rules = [
			'customer_id' => 'required',
			'vessel_id' => 'required',
		];


		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response =  $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return  $firstError;
		}
		return [];
	}



	public function store(Request $request)
	{

		if (!isPermission('add', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$maxCode = Event::where('company_id', $request->company_id)
			->where('company_branch_id', $request->company_branch_id)
			->max('event_no');

		$uuid = $this->get_uuid();

		$insertArr = [
			'company_id' => $request->company_id ?? "",
			'company_branch_id' => $request->company_branch_id ?? "",
			'event_id' => $uuid,
			'event_code' => str_pad($maxCode + 1, 4, '0', STR_PAD_LEFT),
			'event_no' => $maxCode + 1,
			'customer_id' => $request->customer_id ?? "",
			'vessel_id' => $request->vessel_id ?? "",
			'class1_id' => $request->class1_id ?? "",
			'class2_id' => $request->class2_id ?? "",
			'status' => $request->status ?? "",
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => $request->login_user_id,
		];


		$user = Event::InsertGetId($insertArr);
		EventDispatch::create([
			'event_dispatch_id' => $this->get_uuid(),
			'company_id' => $request->company_id,
			'company_branch_id' => $request->company_branch_id,
			'event_id' => $uuid,
			'event_date' => Carbon::now(),
			'event_time' => '00:01'
		]);

		Audit::onInsert(
			[
				"request" => $request,
				"table" => "event",
				"id" => $uuid,
				"document_name" => $insertArr['event_code'],
				"document_type" => "event",
				"json_data" => json_encode($this->show($uuid, false))
			]
		);


		return $this->jsonResponse(['event_id' => $uuid], 200, "Add Event Successfully!");
	}

	public function update(Request $request, $id)
	{
		if (!isPermission('edit', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");


		// Validation Rules
		$isError = $this->validateRequest($request->all(), $id);
		if (!empty($isError)) return $this->jsonResponse($isError, 400, "Request Failed!");

		$data  = Event::where('event_id', $id)->first();
		$data->company_id  = $request->company_id;
		$data->company_branch_id  = $request->company_branch_id;
		$data->event_code  = $request->event_code ?? "";
		$data->event_no  = $request->event_no ?? "";
		$data->customer_id  = $request->customer_id ?? "";
		$data->vessel_id  = $request->vessel_id ?? "";
		$data->class1_id  = $request->class1_id ?? "";
		$data->class2_id  = $request->class2_id ?? "";
		$data->status  = $request->status ?? "";
		$data->updated_at = date('Y-m-d H:i:s');
		$data->updated_by = $request->login_user_id;
		$data->update();


		Audit::onEdit(
			[
				"request" => $request,
				"table" => "event",
				"id" => $id,
				"document_name" => $data->event_code,
				"document_type" => "event",
				"json_data" => json_encode($this->show($id, false))
			]
		);


		return $this->jsonResponse(['event_id' => $id], 200, "Update Event Successfully!");
	}
	public function delete($id, Request $request)
	{
		if (!isPermission('delete', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		$data  = Event::where('event_id', $id)->first();
		if (!$data) return $this->jsonResponse(['event_id' => $id], 404, "Event Not Found!");
		$validate = [
			'main' => [
				'check' => new Event,
				'id' => $id,
			],
			'with' => [
				['model' => new Quotation],
			]
		];

		$response = $this->checkAndDelete($validate);
		if ($response['error']) {
			return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
		}

		Audit::onDelete(
			[
				"request" => $request,
				"table" => "event",
				"id" => $id,
				"document_name" => $data->event_code,
				"document_type" => "event",
				"json_data" => json_encode($this->show($id, false))
			]
		);

		$data->delete();
		EventDispatch::where(['event_id' => $id])->delete();
		return $this->jsonResponse(['event_id' => $id], 200, "Delete Event Successfully!");
	}
	public function bulkDelete(Request $request)
	{
		if (!isPermission('delete', 'event', $request->permission_list))
			return $this->jsonResponse('Permission Denied!', 403, "No Permission");

		try {
			if (isset($request->event_ids) && !empty($request->event_ids) && is_array($request->event_ids)) {
				foreach ($request->event_ids as $event_id) {
					$data = Event::where(['event_id' => $event_id])->first();

					$validate = [
						'main' => [
							'check' => new Event,
							'id' => $event_id,
						],
						'with' => [
							['model' => new Quotation],
						]
					];

					$response = $this->checkAndDelete($validate);
					if ($response['error']) {
						return $this->jsonResponse($response['msg'], $response['error_code'], "Deletion Failed!");
					}

					Audit::onDelete(
						[
							"request" => $request,
							"table" => "event",
							"id" => $event_id,
							"document_name" => $data->event_code,
							"document_type" => "event",
							"json_data" => json_encode($this->show($event_id, false))
						]
					);

					$data->delete();
					EventDispatch::where(['event_id' => $event_id])->delete();
				}
			}

			return $this->jsonResponse('Deleted', 200, "Delete Event successfully!");
		} catch (\Exception $e) {
			return $this->jsonResponse('some error occured', 500, $e->getMessage());
		}
	}
}
