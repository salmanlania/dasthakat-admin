<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\CoaLevel1;
use App\Models\CoaLevel2;
use App\Models\CoaLevel3;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CoaLevel3Controller extends Controller
{
    public function index(Request $request)
    {
        $level3_code    = $request->input('level3_code', '');
        $name           = $request->input('name', '');
        $coa_level1_id  = $request->input('coa_level1_id', '');
        $coa_level2_id  = $request->input('coa_level2_id', '');
        $status         = $request->input('status', '');
        $search         = $request->input('search', '');
        $page           = $request->input('page', 1);
        $perPage        = $request->input('limit', 10);
        $sort_column    = $request->input('sort_column', 'created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';

        $coaLevel1Table = (new CoaLevel1)->getTable();
        $coaLevel2Table = (new CoaLevel2)->getTable();
        $coaLevel3Table = (new CoaLevel3)->getTable();
        $data = CoaLevel3::from($coaLevel3Table . ' as c3')
            ->join($coaLevel2Table . ' as c2', 'c3.coa_level2_id', '=', 'c2.coa_level2_id')
            ->join($coaLevel1Table . ' as c1', 'c2.coa_level1_id', '=', 'c1.coa_level1_id');
        if (!empty($request->company_id)) {
            $data = $data->where('c3.company_id', '=', $request->company_id);
        }
        if (!empty($coa_level1_id)) $data = $data->where('c1.coa_level1_id', $coa_level1_id);
        if (!empty($coa_level2_id)) $data = $data->where('c2.coa_level2_id', $coa_level2_id);
        if (!empty($level3_code))  $data = $data->where('c3.level3_code', 'like', '%'.$level3_code.'%');
        if (!empty($name))         $data = $data->where('c3.name', 'like', '%'.$name.'%');
        if ($status !== '' && $status !== null) $data = $data->where('c3.status', $status);

        if (!empty($search)) {
            $s = strtolower($search);
            $data = $data->where(function($q) use ($s) {
                $q->where('c3.name', 'like', '%'.$s.'%')
                  ->orWhere('c3.level3_code', 'like', '%'.$s.'%')
                  ->orWhere('c2.name', 'like', '%'.$s.'%')
                  ->orWhere('c1.name', 'like', '%'.$s.'%');
            });
        }

        $data = $data->select('c3.*', 'c2.name as coa_level2_name', 'c1.name as coa_level1_name',
        DB::raw("CONCAT(`c1`.`level1_code`,':',`c1`.`name`) AS `level1_display_name`"),
        DB::raw("CONCAT(`c1`.`level1_code`,'-',`c2`.`level2_code`,':',`c2`.`name`) AS `level2_display_name`"),
        DB::raw("CONCAT(`c1`.`level1_code`,'-',`c2`.`level2_code`,'-',`c3`.`level3_code`,':',`c3`.`name`) AS `level3_display_name`"))
                     ->orderBy($sort_column, $sort_direction)
                     ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function show($id, Request $request)
    {
        $data = CoaLevel3::with('coa_level2', 'coa_level1')->where('coa_level3_id', $id)->first();
        return $this->jsonResponse($data, 200, 'COA Level3 Data');
    }

    protected function validateRequest($request, $id = null)
    {
        $rules = [
            'company_id'    => ['required'],
            'coa_level1_id' => ['required'],
            'coa_level2_id' => ['required'],
            'level3_code'   => ['required', Rule::unique('coa_level3')->ignore($id, 'coa_level3_id')->where('company_id', $request['company_id'])->where('coa_level1_id', $request['coa_level1_id'])->where('coa_level2_id', $request['coa_level2_id'])],
            'name'          => ['required', Rule::unique('coa_level3')->ignore($id, 'coa_level3_id')->where('company_id', $request['company_id'])->where('coa_level1_id', $request['coa_level1_id'])->where('coa_level2_id', $request['coa_level2_id'])],
            'status'        => ['nullable', 'integer']
        ];

        $validator = Validator::make($request, $rules);
        if ($validator->fails()) {
            return $validator->errors()->first();
        }
        return [];
    }

    public function store(Request $request)
    {
        if (!isPermission('add', 'coa_level3', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        if (!CoaLevel1::where('coa_level1_id', $request->coa_level1_id)->exists())
            return $this->jsonResponse('Invalid coa_level1_id', 400, 'Request Failed!');
        if (!CoaLevel2::where('coa_level2_id', $request->coa_level2_id)->exists())
            return $this->jsonResponse('Invalid coa_level2_id', 400, 'Request Failed!');

        $uuid = $this->get_uuid();
        $insertArr = [
            'coa_level3_id' => $uuid,
            'company_id'    => $request->company_id ?? '',
            'coa_level1_id' => $request->coa_level1_id ?? '',
            'coa_level2_id' => $request->coa_level2_id ?? '',
            'level3_code'   => $request->level3_code ?? '',
            'name'          => $request->name ?? '',
            'status'        => $request->status ?? 1,
            'created_at'    => Carbon::now(),
            'created_by'    => $request->login_user_id,
        ];

        CoaLevel3::create($insertArr);
        return $this->jsonResponse(['coa_level3_id' => $uuid], 200, 'Add COA Level3 Successfully!');
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'coa_level3', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $data = CoaLevel3::where('coa_level3_id', $id)->first();
        if (!$data) return $this->jsonResponse('Record not found', 404, 'Not Found');

        $data->company_id    = $request->company_id;
        $data->coa_level1_id = $request->coa_level1_id ?? $data->coa_level1_id;
        $data->coa_level2_id = $request->coa_level2_id ?? $data->coa_level2_id;
        $data->level3_code   = $request->level3_code ?? $data->level3_code;
        $data->name          = $request->name ?? $data->name;
        $data->status        = $request->status ?? $data->status;
        $data->updated_at    = Carbon::now();
        $data->updated_by    = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['coa_level3_id' => $id], 200, 'Update COA Level3 Successfully!');
    }

    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'coa_level3', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $data = CoaLevel3::where('coa_level3_id', $id)->first();
        if (!$data) return $this->jsonResponse(['coa_level3_id' => $id], 404, 'COA Level3 Not Found!');

        $validate = [
            'main' => [
                'check' => new CoaLevel3,
                'id'    => $id,
            ],
            'with' => [
            ]
        ];

        $response = $this->checkAndDelete($validate);
        if ($response['error']) {
            return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
        }

        $data->delete();
        return $this->jsonResponse(['coa_level3_id' => $id], 200, 'Delete COA Level3 Successfully!');
    }

    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'coa_level3', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        try {
            if (isset($request->coa_level3_ids) && is_array($request->coa_level3_ids)) {
                foreach ($request->coa_level3_ids as $coa_level3_id) {
                    $row = CoaLevel3::where('coa_level3_id', $coa_level3_id)->first();
                    if (!$row) continue;

                    $validate = [
                        'main' => [
                            'check' => new CoaLevel3,
                            'id'    => $coa_level3_id,
                        ],
                        'with' => [
                        ]
                    ];

                    $response = $this->checkAndDelete($validate);
                    if ($response['error']) {
                        return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
                    }

                    $row->delete();
                }
            }
            return $this->jsonResponse('Deleted', 200, 'Delete COA Level3 successfully!');
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
