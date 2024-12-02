<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ProxyTestController extends Controller
{
    public function testProxy(Request $request)
    {
        // Read proxy settings from environment variables
        $proxy = env('HTTP_PROXY');

        // Initialize Guzzle client with proxy settings
        $client = new Client([
            'proxy' => $proxy,
            'timeout' => 10.0,
        ]);

        try {
            // Make a test request
            $response = $client->request('GET', 'https://httpbin.org/ip');
            $body = $response->getBody();
            $statusCode = $response->getStatusCode();

            return response()->json([
                'status' => $statusCode,
                'body' => $body,
            ]);
        } catch (RequestException $e) {
            // Handle exception and return error details
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}