<?php

namespace App\Http\Controllers;

use Illuminate\Database\DatabaseManager;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenerateMail;
use App\Models\Audit;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class Controller extends BaseController
{
    protected $db;

    public function __construct(DatabaseManager $db)
    {
        $this->middleware('auth:api', ['except' => ['login', 'session', 'refresh', 'logout', 'verify-email', 'reset-password']]);
        $this->db = $db;
    }


    public function updateMailSettings($host, $port, $encryption, $username, $password)
    {
        Config::set('mail.mailers.smtp.host', $host);
        Config::set('mail.mailers.smtp.port', $port);
        Config::set('mail.mailers.smtp.encryption', $encryption);
        Config::set('mail.mailers.smtp.username', $username);
        Config::set('mail.mailers.smtp.password', $password);

        // Optional: Force configuration cache to update if caching is enabled
    }

    public function sentMail($data)
    {

        if (empty($data['name'])) return false;

        //if Debug on email will be sent to administrator only
        $config = Setting::where('module', 'general')->pluck('value', 'field');
        if (@$config['debug'] == 1) {
            $data["email"] = $config['debug_email'];
        }

        $_return = "";
        // Email Generate update Settings
        $this->getSettings(true);

        try {
            $insdata = [
                'name' => $data['name'],
                'subject' => $data['subject'],
                'message' => $data['message']
            ];

            Mail::to($data["email"])->send(new GenerateMail($insdata));
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            $_return = "Email Not Sent.Please Check Your Email or Contact to your Administrator!";
        }

        return $_return;
    }

    public function SystemConfig($module = 'general')
    {
        return  Setting::where('module', $module)->pluck('value', 'field');
    }

    public function getSettings($is_email = false)
    {

        $config = Setting::where('module', 'general')->pluck('value', 'field');
        $setting = [
            'host' => @$config['smtm_host'] ? @$config['smtm_host'] : env('MAIL_HOST'),
            'port' => @$config['smtm_port'] ? @$config['smtm_port'] : env('MAIL_PORT'),
            'encryption' =>   env('MAIL_ENCRYPTION'),
            'username' => @$config['smtp_user'] ? @$config['smtp_user'] :  env('MAIL_USERNAME'),
            'password' => @$config['smtp_password'] ? @$config['smtp_password'] :  env('MAIL_PASSWORD')
        ];
        if ($is_email == true)
            updateMailConfig($setting);
    }


    public function testApi()
    {
        return response()->json(['success' => true, 'msg' => 'Backend Working']);
    }
    /**
     * --------------------------------------------------------------------------------
     * Get UUID for Unique Key
     * --------------------------------------------------------------------------------
     */
    function get_uuid()
    {
        return Str::uuid()->toString();
    }
    public function base64ToImage($dataUrl, $targetDir = 'public/uploads/', $uniAlpha = 'A', $originalName = "")
    {
        // Define allowed MIME types and their corresponding file extensions
        $mimeTypes = [
            'application/pdf' => 'pdf',
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx'
        ];

        // Regular expression to match data URL and capture MIME type
        if (preg_match('/^data:(application\/pdf|image\/jpeg|image\/jpg|image\/png|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.openxmlformats-officedocument.presentationml.presentation);base64,/', $dataUrl, $matches)) {

            $mimeType = $matches[1];
            $extension = $mimeTypes[$mimeType];

            // Extract base64 data
            $base64Data = substr($dataUrl, strpos($dataUrl, ',') + 1);
            $decodedData = base64_decode($base64Data, true);

            if ($decodedData === false) {
                return response()->json(['error' => 'Base64 decode failed'], 400);
            }

            // Generate a unique file name
            $fileName = ($originalName == "") ? 'file-' . $uniAlpha . '-' . time() . '.' . $extension : $originalName;
            $filePath = base_path($targetDir . $fileName);
            if (file_exists($filePath)) {
                $fileName = explode('.', $fileName);
                $fileName = $fileName[0] . '-' . time() . '.' . $fileName[1];
                $filePath = base_path($targetDir . $fileName);
            }

            // Save file to disk
            try {
                // Ensure the target directory exists
                if (!file_exists($targetDir)) {
                    mkdir($targetDir, 0755, true);
                }

                file_put_contents($filePath, $decodedData);

                if (in_array($mimeType, ['image/jpeg', 'image/jpg', 'image/png'])) {
                    // Compress image
                    // $this->compressAndSaveImage($filePath, $filePath);
                }

                filesize($filePath);
            } catch (\Exception $e) {
                // Log::error('Failed to save file: ' . $e->getMessage());
                return response()->json(['error' => $e->getMessage()], 500);
            }

            return $fileName;
        } else {
            return response()->json(['error' => 'Invalid data URL'], 400);
        }
    }


    public function compressAndSaveImage($sourcePath, $destinationPath, $quality = 75)
    {
        $info = getimagesize($sourcePath);

        if ($info['mime'] == 'image/jpeg') {
            $image = imagecreatefromjpeg($sourcePath);
            imagejpeg($image, $destinationPath, $quality);
        } elseif ($info['mime'] == 'image/png') {
            $image = imagecreatefrompng($sourcePath);
            imagepng($image, $destinationPath, $quality / 10); // PNG quality is between 0 and 9
        }

        imagedestroy($image);
    }


    public function processImage($imageData)
    {
        // Extract the base64 part from the string
        $imageParts = explode(';base64,', $imageData);

        // Check if the data format is valid
        if (count($imageParts) != 2) {
            throw new \Exception('Invalid image data format.');
        }

        // Get the base64 encoded data
        $imageBase64 = $imageParts[1];

        // Decode the base64 string
        $image = base64_decode($imageBase64);

        // Generate a filename
        $filename = uniqid() . '.png'; // You can choose other formats like '.jpg' or '.jpeg' as needed

        // Save the image to storage
        Storage::disk('public')->put($filename, $image);

        return $filename;
    }

    /**
     * --------------------------------------------------------------------------------
     * Get all api response
     * --------------------------------------------------------------------------------
     */
    protected function apiResponse($data = [], $status = 200, $message = 'success'): object
    {
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName($status),
            'status_code' => $status,
            'employee' => $data
        ], $status);
    }

    protected function jsonResponse($data = [], $status_code = 200, $message = ''): object
    {
        $responseKey = ($status_code != 200) ? 'error' : 'data';
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName($status_code),
            'status_code' => $status_code,
            $responseKey => $data
        ], $status_code);
    }

    protected function checkAndDelete($req)
    {
        $primary_key = $req['main']['check']->getKeyName();
        $get_data = $req['main']['check']::where($primary_key, $req['main']['id'])->first();
        $display_name = 'name';
        if (isset($req['display']['name'])) {
            $display_name = $req['display']['name'];
        }
        if (!$get_data) {
            return ['error' => true, 'error_code' => 404, 'msg' =>  camelCaseToSpace(class_basename($req['main']['check'])) . " Not Found!"];
        }

        foreach ($req['with'] as $model) {
            $foreign_keys = $primary_key;
            if (isset($model['key']) && !empty($model['key'])) {
                $foreign_keys = $model['key'];
            }
            if (is_string($foreign_keys)) {
                $foreign_keys = [$foreign_keys];
            }
            foreach ((array)$foreign_keys as $foreign_key) {
                if ($model['model']::where($foreign_key, $req['main']['id'])->exists()) {
                    return [
                        'error' => true,
                        'error_code' => 400,
                        'msg' => "You cannot delete " . $get_data[$display_name] . " as it has associated records in " . camelCaseToSpace(class_basename($model['model']))
                    ];
                }
            }
        }
        return ['error' => false, 'error_code' => 200, 'msg' => ""];
    }


    protected function auditAction($request, $action, $action_on, $document_type, $document_id, $document_name, $data)
    {
        $audit = [
            'action' => $action,
            'action_on' => $action_on,
            'request' => $request,
            'document_type' => $document_type,
            'document_id' => $document_id,
            'document_name' => $document_name,
            'json_data' => json_encode($data),
        ];

        Audit::create([
            'company_id' => $audit['request']['company_id'],
            'company_branch_id' => $audit['request']['company_branch_id'],
            'action' => $audit['action'],
            'action_on' => $audit['action_on'],
            'action_by' => $audit['request']['login_user_id'],
            'action_at' => date('Y-m-d H:i:s'),
            'document_type' => $audit['document_type'],
            'document_id' => $audit['document_id'],
            'document_name' => $audit['document_name'],
            'json_data' => $audit['json_data'],
        ]);
        // Audit Action
    }


    /**
     * --------------------------------------------------------------------------------
     * Response with token
     * --------------------------------------------------------------------------------
     */
    protected function apiResponseWithToken($data, $token, $message = ''): object
    {
        return response()->json([
            'message' => $message,
            'status' => $this->getStatusName(200),
            'status_code' => 200,
            'token_type' => $token->type,
            'token' => $token->access_token,
            'employee' => $data,
            'expires_in' => $token->expiry
        ], 200);
    }


    /**
     * --------------------------------------------------------------------------------
     * Get status name
     * --------------------------------------------------------------------------------
     */
    private function getStatusName(int $code): string
    {
        $status = [
            200 => 'Success',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
        ];

        return $status[$code];
    }
}
