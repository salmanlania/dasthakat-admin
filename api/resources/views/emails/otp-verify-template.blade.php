<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification - Global Marine Safety</title>

</head>

<body
    style="margin: 0; padding: 20px 0 ; background-color: #eee; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
        style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 7px;border:1px solid #0000002a; overflow: hidden;">

        <!-- Header / Logo -->
        <tr>
            <td style="padding: 20px; border-top:5px solid #0650985a !important;">
                <img src="{{ url('public/images/logo-with-title.png') }}" alt="Global Marine Safety - America" height="100" />
            </td>

        </tr>

        <tr>
            <td style="padding:0 30px;">
                <h2 style="color: #065098; margin-bottom: 5px;">Hi {{ $data['name'] ?? 'Unknown' }},</h2>
                <p style="font-size: 13px; color: #5e5e5e; line-height: 1.6;">
                    For your security, we need to confirm it's really you trying to sign in. Please use the one-time
                    password (OTP) below to verify your login:
                </p>
                <p style="font-size: 14px; color: #5e5e5e; line-height: 1;">
                    If you didn’t request this, you can safely ignore this email.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                    <span
                        style="display: inline-block; padding: 14px 28px; font-size: 24px; background-color: #e6f0ff; color: #065098; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
                        {{ $data['data']['otp'] ?? 'xxxxxx' }}

                    </span>
                </div>

            </td>
        </tr>

        <tr>
            <td style="padding: 20px; text-align: center;  font-size: 13px; color: #5e5e5e;">
                &copy; {{ date('Y') }} Global Marine Safety - America. All rights reserved.
            </td>
        </tr>
    </table>
</body>

</html>
