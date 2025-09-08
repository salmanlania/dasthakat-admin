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
use App\Models\GRNDetail;
use App\Models\PicklistReceivedDetail;
use App\Models\PurchaseInvoiceDetail;
use App\Models\PurchaseReturnDetail;
use App\Models\SaleInvoice;
use App\Models\SaleInvoiceDetail;
use App\Models\SaleReturnDetail;
use App\Models\ServicelistReceivedDetail;
use App\Models\Shipment;
use App\Models\ShipmentDetail;
use App\Models\User;
use Carbon\Carbon;
use Error;
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
    public function whatsAppAPI($data, $setting)
    {
        $url = $setting['url'];
        $data = json_encode($data);
        $authorization = "Authorization: Bearer " . $setting['token'];
        $headers =  [
            "Content-Type: application/json",
            "Accept: application/json",
            $authorization
        ];

        try {
            Log::info('WAAPI Request URL: ' . $url);
            Log::info('WAAPI Request Headers: ' . json_encode($headers));
            Log::info('WAAPI Request Payload: ' . $data);

            $cc = curl_init();
            curl_setopt($cc, CURLOPT_URL, $url);
            curl_setopt($cc, CURLOPT_POST, true);
            curl_setopt($cc, CURLOPT_POSTFIELDS, $data);
            curl_setopt($cc, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($cc, CURLOPT_HTTPHEADER, $headers);
            $response = curl_exec($cc);

            if (curl_errno($cc)) {
                Log::error('WAAPI CURL Error: ' . curl_error($cc));
            } else {
                Log::info('WAAPI Response: ' . $response);
            }

            curl_close($cc);
        } catch (\Exception $e) {
            Log::error('WhatsApp API Exception: ' . $e->getMessage());
        }
    }

    /**
     * Sends an email with proper error handling and logging
     * 
     * @param array $data Email data including recipient, subject, template etc.
     * @return string Empty string on success, error message on failure
     */
    public function sendEmail(array $data): string
    {

        $mailConfig = $this->getValidatedMailConfig();
        if (!is_array($mailConfig)) {
            return $mailConfig; // Returns error message
        }
        $this->getSettings(true);

        $recipientEmail = $this->getRecipientEmail($data['email'] ?? '', $mailConfig);
        $emailData = $this->prepareEmailData($data);
        try {
            Mail::to($recipientEmail)->send(new GenerateMail($emailData));
            return '';
        } catch (\Exception $e) {
            Log::error('Email sending failed', [
                'error' => $e->getMessage(),
                'recipient' => $recipientEmail,
                'subject' => $data['subject'] ?? ''
            ]);
            return $e->getMessage();
        }
    }

    /**
     * Validates and retrieves mail configuration
     * 
     * @return array|string Returns config array or error message
     */
    private function getValidatedMailConfig()
    {
        $requiredConfig = [
            'smtp_user',
            'smtp_password',
            'smtp_host',
            'smtp_port',
            'smtp_encryption',
            'mail_type',
            'display_name'
        ];

        $config = Setting::where('module', 'mail')
            ->pluck('value', 'field')
            ->toArray();

        foreach ($requiredConfig as $key) {
            if (empty($config[$key])) {
                return "Mail configuration incomplete. Missing: $key";
            }
        }

        return $config;
    }

    /**
     * Determines recipient email based on debug mode
     */
    private function getRecipientEmail(string $originalEmail, array $config): string
    {
        return ($config['debug'] == 1)
            ? $config['debug_email']
            : $originalEmail;
    }

    /**
     * Prepares structured email data
     */
    private function prepareEmailData(array $data): array
    {
        return [
            'template' => $data['template'] ?? '',
            'name' => $data['name'] ?? 'Unknown User',
            'subject' => $data['subject'],
            'message' => $data['message'],
            'data' => $data['data'] ?? [],
        ];
    }

    public function SystemConfig($module = 'general')
    {
        return  Setting::where('module', $module)->pluck('value', 'field');
    }

    public function getSettings($is_email = false)
    {

        $config = Setting::where('module', 'mail')->pluck('value', 'field');
        $setting = [
            'host' => @$config['smtp_host'] ? @$config['smtp_host'] : env('MAIL_HOST'),
            'port' => @$config['smtp_port'] ? @$config['smtp_port'] : env('MAIL_PORT'),
            'encryption' => @$config['smtp_encryption'] ? @$config['smtp_encryption'] :  env('MAIL_ENCRYPTION'),
            'username' => @$config['smtp_user'] ? @$config['smtp_user'] :  env('MAIL_USERNAME'),
            'password' => @$config['smtp_password'] ? @$config['smtp_password'] :  env('MAIL_PASSWORD'),
            'from_name' => @$config['display_name'] ? @$config['display_name'] : env('MAIL_FROM_NAME'),

        ];
        // dd($setting);
        if ($is_email == true)
            updateMailConfig($setting);
    }



    public function testApi()
    {
        // $users = $this->dbset()->get();

        $users = User::get();
        // exit;

        // test setting
        $this->getSettings(true);

        $data = [
            'email' => 'test',
            'name' => 'Dear Test',
            'subject' => 'Your Dynamic Subject Here',
            'message' => ' Thank you for Registering to our platform.<br>
                    Your Username is example@gmail.com & Password is Elon123@<br>
                    Please remember to login. <br>
		    <br> You can access your Account to management your Quote Request and change your password here. <br> servermail@gmail.com'
        ];


        // Sent Email
        // $this->sentMail($data );
        //     return response()->json(['message' => 'Email sent successfully']);



        return response()->json($users);
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

    public function convertImageToBase64($path)
    {


        if (!file_exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        $imageData = base64_encode(file_get_contents($path));
        $mimeType = mime_content_type($path); // e.g., image/png

        $base64Image = "data:$mimeType;base64,$imageData";

        return $base64Image;
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



    static public function getPickedQuantity($row, array $options = ["addReturnQty" => false])
    {
        if ($row->product_type_id == 1) {
            $quantity = ServicelistReceivedDetail::query()
                ->whereHas('servicelist_received', function ($query) {
                    $query->where('is_deleted', 0);
                })
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');
        } else
		if ($row->product_type_id == 2) {
            $quantity = PicklistReceivedDetail::query()
                ->whereHas('picklist_received', function ($query) {
                    $query->where('is_deleted', 0);
                })
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');

            if ($options["addReturnQty"]) {
                $returnQuantity = SaleReturnDetail::query()
                    ->where('charge_order_detail_id', $row->charge_order_detail_id)
                    ->sum('quantity');
                $quantity = $quantity - $returnQuantity;
            }
        } else
		if ($row->product_type_id == 3 || $row->product_type_id == 4) {
            $quantity = GRNDetail::query()
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');
            if ($options["addReturnQty"]) {
                $returnQuantity = PurchaseReturnDetail::query()
                    ->where('charge_order_detail_id', $row->charge_order_detail_id)
                    ->sum('quantity');
                $quantity = $quantity - $returnQuantity;
            }
        } else {
            $quantity = 0;
        }
        return $quantity;
    }
    static public function getShipmentQuantity($row)
    {
        $quantity = ShipmentDetail::query()
            ->where('charge_order_detail_id', $row->charge_order_detail_id)
            ->sum('quantity');

        return $quantity;
    }
    static public function getInvoicedQuantity($row)
    {
            $quantity = SaleInvoiceDetail::query()
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');
            return $quantity;
    }
    static public function getReturnedQuantity($row)
    {
        if ($row->product_type_id == 2) {
            $quantity = SaleReturnDetail::query()
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');
        } else
		if ($row->product_type_id == 3 || $row->product_type_id == 4) {
            $quantity = PurchaseReturnDetail::query()
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->sum('quantity');
        } else {
            $quantity = 0;
        }
        return $quantity ?? 0;
    }

    static public function getStatus($row)
    {
        $pickedQuantity = self::getPickedQuantity($row,["addReturnQty" => true]);
        $shipmentQuantity = self::getShipmentQuantity($row);
        $invoicedQuantity = self::getInvoicedQuantity($row);

        if ($invoicedQuantity > 0) {
            return "INV";
        } else if ($shipmentQuantity > 0) {
            return "SHP";
        } else if ($pickedQuantity > 0) {
            return "RCVD";
        } else {
            return "Pending";
        }
    }

    static public function getStatusWithDate($row)
    {
        $pickedQuantity = self::getPickedQuantity($row,["addReturnQty" => true]);
        $shipmentQuantity = self::getShipmentQuantity($row);
        $invoicedQuantity = self::getInvoicedQuantity($row);

        $latestDate = null;
        $status = "Pending";

        if ($invoicedQuantity > 0) {
            $status = "INV";
            $latestDate = self::getLatestInvoicedDate($row);
        } else if ($shipmentQuantity > 0) {
            $status = "SHP";
            $latestDate = self::getLatestShipmentDate($row);
        } else if ($pickedQuantity > 0) {
            $status = "RCVD";
            $latestDate = self::getLatestPickedDate($row);
        }

        return [
            'status' => $status,
            'date' => $latestDate
        ];
    }

    static public function getLatestPickedDate($row)
    {
        if ($row->product_type_id == 1) {
            $latestRecord = ServicelistReceivedDetail::query()
            ->join('servicelist_received', 'servicelist_received_detail.servicelist_received_id', '=', 'servicelist_received.servicelist_received_id')
                ->whereHas('servicelist_received', function ($query) {
                    $query->where('is_deleted', 0);
                })
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->latest('servicelist_received.document_date')
                ->first();
        } else if ($row->product_type_id == 2) {
            $latestRecord = PicklistReceivedDetail::query()
            ->join('picklist_received', 'picklist_received_detail.picklist_received_id', '=', 'picklist_received.picklist_received_id')
                ->whereHas('picklist_received', function ($query) {
                    $query->where('is_deleted', 0);
                })
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->latest('picklist_received.document_date')
                ->first();
        } else if ($row->product_type_id == 3 || $row->product_type_id == 4) {
            $latestRecord = GRNDetail::query()
            ->join('good_received_note', 'good_received_note_detail.good_received_note_id', '=', 'good_received_note.good_received_note_id')
                ->where('charge_order_detail_id', $row->charge_order_detail_id)
                ->latest('good_received_note.document_date')
                ->first();
        } else {
            return null;
        }

        return $latestRecord ? $latestRecord->document_date : null;
    }

    static public function getLatestShipmentDate($row)
    {
        $latestRecord = ShipmentDetail::query()
            ->join('shipment', 'shipment_detail.shipment_id', '=', 'shipment.shipment_id')
            ->where('charge_order_detail_id', $row->charge_order_detail_id)
            ->latest('shipment.document_date')
            ->first();

        return $latestRecord ? $latestRecord->document_date : null;
    }

    static public function getLatestInvoicedDate($row)
    {
        $latestRecord = SaleInvoiceDetail::query()
        ->join('sale_invoice', 'sale_invoice_detail.sale_invoice_id', '=', 'sale_invoice.sale_invoice_id')
              ->where('charge_order_detail_id', $row->charge_order_detail_id)
              ->latest('sale_invoice.document_date')
              ->first();
    

        return $latestRecord ? $latestRecord->document_date : null;
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
