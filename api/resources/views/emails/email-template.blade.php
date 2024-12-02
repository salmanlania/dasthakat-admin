<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        body {
              font-family: Arial, sans-serif;
             margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
           
        }
   
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .order-details,
        .items-table {
            margin-top: 20px;
        }
        .order-details p,
        .items-table table {
            font-size: 14px;
            line-height: 1.6;
        }
        .order-details p {
            margin: 5px 0;
        }
        .items-table table {
            width: 100%;
            border-collapse: collapse;
        }
        .items-table th,
        .items-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background-color: #f9f9f9;
        }

    </style>
</head>
<body>
    <div class="content">
        <h3>{{$data['name'] }},</h3>
        <p>{!! $data['message'] !!}</p>
        
	
	<img src="{{url('public/logo.png')}}" />
    </div>
</body>
</html>