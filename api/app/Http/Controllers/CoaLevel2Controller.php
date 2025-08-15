<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\CoaLevel1;
use App\Models\CoaLevel2;
use App\Models\CoaLevel3;
use Carbon\Carbon;

class CoaLevel2Controller extends Controller
{
    public function index(Request $request)
    {
        $level2_code    = $request->input('level2_code', '');
        $name           = $request->input('name', '');
        $coa_level1_id  = $request->input('coa_level1_id', '');
        $status         = $request->input('status', '');
        $search         = $request->input('search', '');
        $page           = $request->input('page', 1);
        $perPage        = $request->input('limit', 10);
        $sort_column    = $request->input('sort_column', 'created_at');
        $sort_direction = ($request->input('sort_direction') == 'ascend') ? 'asc' : 'desc';
        $coaLevel1Table = (new CoaLevel1)->getTable();
        $coaLevel2Table = (new CoaLevel2)->getTable();

        $data = CoaLevel2::from($coaLevel2Table . ' as c2')
            ->join($coaLevel1Table . ' as c1', 'c2.coa_level1_id', '=', 'c1.coa_level1_id');
        if (!empty($request->company_id)) {
            $data = $data->where('c2.company_id', '=', $request->company_id);
        }
        if (!empty($coa_level1_id)) $data = $data->where('c2.coa_level1_id', $coa_level1_id);
        if (!empty($level2_code))  $data = $data->where('c2.level2_code', 'like', '%'.$level2_code.'%');
        if (!empty($name))         $data = $data->where('c2.name', 'like', '%'.$name.'%');
        if ($status !== '' && $status !== null) $data = $data->where('c2.status', $status);

        if (!empty($search)) {
            $s = strtolower($search);
            $data = $data->where(function($q) use ($s) {
                $q->where('c2.name', 'like', '%'.$s.'%')
                  ->orWhere('c2.level2_code', 'like', '%'.$s.'%')
                  ->orWhere('c1.name', 'like', '%'.$s.'%');
            });
        }

        $data = $data->select('c2.*', 'c1.name as coa_level1_name')
                     ->orderBy($sort_column, $sort_direction)
                     ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function show($id, Request $request)
    {
        $data = CoaLevel2::with('coa_level1')->where('coa_level2_id', $id)->first();
        return $this->jsonResponse($data, 200, 'COA Level2 Data');
    }

    protected function validateRequest($request, $id = null)
    {
        $rules = [
            'company_id'    => ['required'],
            'coa_level1_id' => ['required'],
            'level2_code'   => ['required', Rule::unique('coa_level2')->ignore($id, 'coa_level2_id')->where('company_id', $request['company_id'])->where('coa_level1_id', $request['coa_level1_id'])],
            'name'          => ['required', Rule::unique('coa_level2')->ignore($id, 'coa_level2_id')->where('company_id', $request['company_id'])->where('coa_level1_id', $request['coa_level1_id'])],
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
        if (!isPermission('add', 'coa_level2', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all());
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        // verify parent exists (optional but safer)
        if (!CoaLevel1::where('coa_level1_id', $request->coa_level1_id)->exists())
            return $this->jsonResponse('Invalid coa_level1_id', 400, 'Request Failed!');

        $uuid = $this->get_uuid();
        $insertArr = [
            'coa_level2_id' => $uuid,
            'company_id'    => $request->company_id ?? '',
            'coa_level1_id' => $request->coa_level1_id ?? '',
            'level2_code'   => $request->level2_code ?? '',
            'name'          => $request->name ?? '',
            'status'        => $request->status ?? 1,
            'created_at'    => Carbon::now(),
            'created_by'    => $request->login_user_id,
        ];

        CoaLevel2::create($insertArr);
        return $this->jsonResponse(['coa_level2_id' => $uuid], 200, 'Add COA Level2 Successfully!');
    }

    public function update(Request $request, $id)
    {
        if (!isPermission('edit', 'coa_level2', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $isError = $this->validateRequest($request->all(), $id);
        if (!empty($isError)) return $this->jsonResponse($isError, 400, 'Request Failed!');

        $data = CoaLevel2::where('coa_level2_id', $id)->first();
        if (!$data) return $this->jsonResponse('Record not found', 404, 'Not Found');

        $data->company_id    = $request->company_id;
        $data->coa_level1_id = $request->coa_level1_id ?? $data->coa_level1_id;
        $data->level2_code   = $request->level2_code ?? $data->level2_code;
        $data->name          = $request->name ?? $data->name;
        $data->status        = $request->status ?? $data->status;
        $data->updated_at    = Carbon::now();
        $data->updated_by    = $request->login_user_id;
        $data->update();

        return $this->jsonResponse(['coa_level2_id' => $id], 200, 'Update COA Level2 Successfully!');
    }

    public function delete($id, Request $request)
    {
        if (!isPermission('delete', 'coa_level2', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        $data = CoaLevel2::where('coa_level2_id', $id)->first();
        if (!$data) return $this->jsonResponse(['coa_level2_id' => $id], 404, 'COA Level2 Not Found!');

        $validate = [
            'main' => [
                'check' => new CoaLevel2,
                'id'    => $id,
            ],
            'with' => [
                ['model' => new CoaLevel3],
            ]
        ];

        $response = $this->checkAndDelete($validate);
        if ($response['error']) {
            return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
        }

        $data->delete();
        return $this->jsonResponse(['coa_level2_id' => $id], 200, 'Delete COA Level2 Successfully!');
    }

    public function bulkDelete(Request $request)
    {
        if (!isPermission('delete', 'coa_level2', $request->permission_list))
            return $this->jsonResponse('Permission Denied!', 403, 'No Permission');

        try {
            if (isset($request->coa_level2_ids) && is_array($request->coa_level2_ids)) {
                foreach ($request->coa_level2_ids as $coa_level2_id) {
                    $row = CoaLevel2::where('coa_level2_id', $coa_level2_id)->first();
                    if (!$row) continue;

                    $validate = [
                        'main' => [
                            'check' => new CoaLevel2,
                            'id'    => $coa_level2_id,
                        ],
                        'with' => [
                            ['model' => new CoaLevel3],
                        ]
                    ];

                    $response = $this->checkAndDelete($validate);
                    if ($response['error']) {
                        return $this->jsonResponse($response['msg'], $response['error_code'], 'Deletion Failed!');
                    }

                    $row->delete();
                }
            }
            return $this->jsonResponse('Deleted', 200, 'Delete COA Level2 successfully!');
        } catch (\Exception $e) {
            return $this->jsonResponse('some error occured', 500, $e->getMessage());
        }
    }
}
