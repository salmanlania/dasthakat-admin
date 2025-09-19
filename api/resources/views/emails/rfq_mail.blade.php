<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RFQ Request</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, sans-serif;
        }

        table {
            border-spacing: 0;
            width: 100%;
        }

        td {
            padding: 0;
        }

        img {
            border: 0;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f4;
            padding: 20px 0;
        }

        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
        }

        .header {
            background: #065098;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .header img {
            max-width: 150px;
            margin-bottom: 10px;
        }

        .content {
            padding: 20px;
            color: #333333;
            font-size: 16px;
            line-height: 1.5;
        }

        .content h1 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .content table th,
        .content table td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
            font-size: 14px;
        }

        .content table th {
            background-color: #f4f4f4;
        }

        .cta-button {
            display: inline-block;
            background: #065098;
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 400;
            margin-top: 20px;
        }

        .footer {
            background: #f4f4f4;
            text-align: center;
            font-size: 13px;
            color: #888888;
            padding: 20px;
        }

        .footer a {
            color: #888888;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <!-- HEADER -->
            <tr>
                <td class="header">
                    <img src="{{ url('public/images/logo-with-title.png') }}" alt="Global Marine Safety - America"
                        height="100" />
                    <h2>Request for Quotation</h2>
                </td>
            </tr>

            <!-- CONTENT -->
            <tr>
                <td class="content">
                    <p>Dear <strong>{{ $data['name'] ?? "" }}</strong>,</p>
                    <p>
                        You have been invited to submit your quotation for the items listed below.
                        Please review the details and click the button below to submit your price.
                    </p>

                    <p><strong>Vendor Platform No:</strong> {{ $data['data']['vendor_platform_no'] ?? "" }} <br />
                        <strong>Submission Before:</strong> {{ $data['data']['date_required'] ?? "" }}
                    </p>


                    <!-- CTA BUTTON -->
                    <p style="text-align:center;">
                        <a href="{{$data['data']['link'] ?? "#"}}"
                            class="cta-button">Submit Your Price</a>
                    </p>

                    <p style="font-size: 14px;">If the button doesn’t work, click this link:<br />
                        <a
                            href="{{$data['data']['link'] ?? "#"}}">
                            {{$data['data']['link'] ?? "#"}}
                        </a>
                    </p>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td class="footer">Global Marine Safety - America. All rights reserved.
                </td>
            </tr>
        </table>
    </center>
</body>

</html>
