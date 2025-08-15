<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\CoaLevel1;
use App\Models\CoaLevel2;
use App\Models\ConstGlType;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CoaLevel1Controller extends Controller
{
    public function index(Request $request)
    {
        $level1_code    = $request->input('level1_code', '');
        $name           = $request->input('name', '');
        $gl_type_id     = $request->input('gl_type_id', '');
        $status         = $request->input('status', '');
        $search         = $request->input('search', '');
        $page           = $request->input('page', 1);
        $perPage        = $request->input('limit', 10);
        $sort_column    = $request->input('sort_column', 'c1.created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        // Dynamic table names
        $coaLevel1Table = (new CoaLevel1)->getTable();
        $glTypeTable    = (new ConstGlType)->getTable();

        $data = CoaLevel1::from($coaLevel1Table . ' as c1')
            ->join($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id');

        if (!empty($request->company_id)) {
            $data->where('c1.company_id', '=', $request->company_id);
        }

        if (!empty($level1_code)) {
            $data->where('c1.level1_code', 'like', '%' . $level1_code . '%');
        }
        if (!empty($name)) {
            $data->where('c1.name', 'like', '%' . $name . '%');
        }
        if ($gl_type_id !== '' && $gl_type_id !== null) {
            $data->where('c1.gl_type_id', $gl_type_id);
        }
        if ($status !== '' && $status !== null) {
            $data->where('c1.status', $status);
        }

        if (!empty($search)) {
            $s = strtolower($search);
            $data->where(function ($q) use ($s) {
                $q->where('c1.name', 'like', '%' . $s . '%')
                    ->orWhere('c1.level1_code', 'like', '%' . $s . '%');
            });
        }

        $data = $data->select('c1.*', 'gl_type.name as gl_type',
                DB::raw("CONCAT(c1.level1_code, ':', c1.name) as level1_display_name"))
            ->orderBy($sort_column, $sort_direction)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function show($id, Request $request)
    {
        $coaLevel1Table = (new CoaLevel1)->getTable();
        $glTypeTable = (new ConstGlType)->getTable();

        $data = CoaLevel1::from($coaLevel1Table . ' as c1')
            ->join($glTypeTable . ' as gl_type', 'c1.gl_type_id', '=', 'gl_type.gl_type_id')
            ->where('c1.coa_level1_id', $id)
            ->select('c1.*', 'gl_type.name as gl_type')
            ->first();

        return $this->jsonResponse($data, 200, 'COA Level1 Data');
    }

    protected function validateRequest($request, $id = null)
    {
        $rules = [
            'company_id'   => ['required'],
            'gl_type_id'   => ['required', 'integer'],
            'level1_code'  => ['required', Rule::unique('coa_level1')->ignore($id, 'coa_level1_id')->where('company_id', $request['company_id'])],
            'name'         => ['required', Rule::unique('coa_level1')->ignore($id, 'coa_level1_id')->where('company_id', $request['company_id'])],
            'status'       => ['nullable', 'integer']
        ];

        $validator = Validator::make($request, $rules);
        if ($validator->fails()) {
            return $validator->errors()->first();
        }
        return [];
    }

    public function store(Request $request)
    {
        if (!isPermission('add', 'coa_level1', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $uuid = $this->get_uuid();
        $insertArr = [
            'coa_level1_id' => $uuid,
            'company_id'    => $request->company_id ?? '',
            'gl_type_id'    => $request->gl_type_id ?? null,
            'level1_code'   => $request->level1_code ?? '',
            'name'          => $request->name ?? '',
            'status'        => $request->status ?? 1,
            'created_at'    => Carbon::now(),
            'created_by'    => $request->login_user_id,
        ];

        CoaLevel1::create($insertArr);
        return $this->jsonResponse(['coa_level1_id' => $uuid], 200, 'Add COA Level1 Successfully!');
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'coa_level1', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $data = CoaLevel1::where('coa_level1_id', $id)->first();
        if (!$data) return $this->jsonResponse('Record not found', 404, 'Not Found');

        $data->company_id  = $request->company_id;
        $data->gl_type_id  = $request->gl_type_id ?? $data->gl_type_id;
        $data->level1_code = $request->level1_code ?? $data->level1_code;
        $data->name        = $request->name ?? $data->name;
        $data->status      = $request->status ?? $data->status;
        $data->updated_at  = Carbon::now();
        $data->updated_by  = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['coa_level1_id' => $id], 200, 'Update COA Level1 Successfully!');
    }

    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'coa_level1', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $data = CoaLevel1::where('coa_level1_id', $id)->first();
        if (!$data) return $this->jsonResponse(['coa_level1_id' => $id], 404, 'COA Level1 Not Found!');

        $validate = [
            'main' => [
                'check' => new CoaLevel1,
                'id'    => $id,
            ],
            'with' => [
                ['model' => new CoaLevel2],
            ]
        ];

        $response = $this->checkAndDelete($validate);
        if ($response['error']) {
            return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
        }

        $data->delete();
        return $this->jsonResponse(['coa_level1_id' => $id], 200, 'Delete COA Level1 Successfully!');
    }

    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'coa_level1', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        try {
            if (isset($request->coa_level1_ids) && is_array($request->coa_level1_ids)) {
                foreach ($request->coa_level1_ids as $coa_level1_id) {
                    $row = CoaLevel1::where('coa_level1_id', $coa_level1_id)->first();
                    if (!$row) continue;

                    $validate = [
                        'main' => [
                            'check' => new CoaLevel1,
                            'id'    => $coa_level1_id,
                        ],
                        'with' => [
                            ['model' => new CoaLevel2],
                        ]
                    ];

                    $response = $this->checkAndDelete($validate);
                    if ($response['error']) {
                        return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
                    }

                    $row->delete();
                }
            }
            return $this->jsonResponse('Deleted', 200, 'Delete COA Level1 successfully!');
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
