<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Audit;

class AuditController extends Controller
{
	protected $db;

	public function index(Request $request)
	{
		$query = Audit::with("action_by_user", "company", "company_branch")
			->leftJoin('user', 'user.user_id', '=', 'audit.action_by')
			->leftJoin('company as c', 'c.company_id', '=', 'audit.company_id')
			->leftJoin('company_branch as cb', 'cb.company_branch_id', '=', 'audit.company_branch_id');

		if ($request->has('company_id')) {
			$query->where('audit.company_id', $request->company_id);
		}

		if ($request->has('company_branch_id')) {
			$query->where('audit.company_branch_id', $request->company_branch_id);
		}

		if ($request->has('action')) {
			$query->where('action', $request->action);
		}

		if ($request->has('action_on')) {
			$query->where('action_on', 'like', '%' . $request->action_on . '%');
		}

		if ($request->has('action_by')) {
			$query->where('action_by', $request->action_by );
		}

		if ($request->has('action_at_from') && $request->has('action_at_to')) {
			$query->whereBetween('action_at',  [$request->action_at_from, $request->action_at_to]);
		}

		if ($request->has('action_at')) {
			$query->where('action_at', $request->action_at);
		}

		if ($request->has('document_type')) {
			$query->where('document_type', 'like', '%' . $request->document_type . '%');
		}

		if ($request->has('document_name')) {
			$query->where('document_name', 'like', '%' . $request->document_name . '%');
		}


		if ($request->has('search')) {
			$search = $request->search;
			$query->where(function ($q) use ($search) {
				$q->where('action', 'like', "%$search%")
					->orWhere('action_by', 'like', "%$search%")
					->orWhere('document_name', 'like', "%$search%")
					->orWhere('document_type', 'like', "%$search%");
			});
		}
		$query->select('audit.company_id', 'audit.company_branch_id', 'audit_id', 'action', 'action_on', 'action_by', 'action_at', 'document_type', 'document_id', 'document_name', 'user.user_name', 'c.name as company_name', 'cb.name as company_branch_name');
		$sortBy = $request->get('sort_column', 'audit_id');
		$sortOrder = ($request->get('sort_direction') == 'ascend') ? 'asc' : 'desc';
		$query->orderBy($sortBy, $sortOrder);

		$perPage = $request->get('limit', 10);
		$page = $request->get('page', 1);
		$audits = $query->paginate($perPage, ['*'], 'page', $page);

		return response()->json($audits);
	}
	public function show($id)
	{

		$data = Audit::find($id);

		if (!$data) {
			return response()->json(['message' => 'Audit not found'], 404);
		}

		return response()->json($data);
	}
}
