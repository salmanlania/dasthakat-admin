<?php

namespace App\Observers;

use App\Models\Audit;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;

class ModelObserver
{
    public function created($model)
    {
        $this->logAudit($model, 'insert');
    }

    public function updated($model)
    {
        $this->logAudit($model, 'update');
    }

    public function deleted($model)
    {
        $this->logAudit($model, 'delete');
    }

    private function logAudit($model, $action)
    {
        $data = Request::all();
        $result = DB::select('SELECT CONNECTION_ID() as connection_id');
        $connectionId = $result[0]->connection_id;

        if ($model instanceof \App\Models\Quotation) {
            $oldData = $action === 'update' ? [...$model->getOriginal(), 'details' => []] : [];
            $newData = [...$model->getAttributes(), 'details' => []];
             Audit::create([
                'batch_identity' => $connectionId,
                'company_id' => $data['company_id'] ?? null,
                'company_branch_id' => $data['company_branch_id'] ?? null,
                'id' => $model->getKey(),
                'table_name' => $model->getTable(),
                'action' => $action,
                'old_data' => $oldData,
                'new_data' => $newData,
                'created_by' => $data['login_user_id'] ?? null,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        } else {
            $log = Audit::where('id', $model->quotation_id)
                ->latest()
                ->first();
            if (isset($log->old_data['details'])) {
                $temp =$log->old_data;
                $temp['details'][] = $model->getOriginal();
                $log->old_data = $temp;
            }
            if (isset($log->new_data['details'])) {
                $temp =$log->new_data;
                $temp['details'][] = $model->getAttributes();
                $log->new_data = $temp;
            }
            $log->save();
        }
      
    }
}
