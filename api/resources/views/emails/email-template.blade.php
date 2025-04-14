<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification - Global Marine Safety</title>
</head>

<body
    style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
        style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">

        <!-- Header / Logo -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #0056b3;">
                <img src="{{ url('public/images/logo-with-title.png') }}" alt="Global Marine Safety - America"
                    width="180" style="margin-bottom: 10px;" />
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #0056b3; margin-bottom: 5px;">Hi {{ $data['name'] ?? "Unknown" }},</h2>
                <p style="font-size: 16px; color: #444; margin-top: 0;">
                    {!! $data['message'] ?? "Known" !!}
                </p>

                <!-- OTP Box -->
                <div style="margin: 30px 0; text-align: center;">
                    <span
                        style="display: inline-block; padding: 14px 28px; font-size: 24px; background-color: #e6f0ff; color: #0056b3; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
                        {{ $data['otp']??"xxxxxx" }}
                    </span>
                </div>

                <!-- Help Text -->
                <p style="font-size: 14px; color: #888;">
                    If you didn’t request this, you can safely ignore this email.
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f1f3f5; font-size: 12px; color: #777;">
                &copy; {{ date('Y') }} Global Marine Safety - America. All rights reserved.
            </td>
        </tr>
    </table>
</body>

</html>
