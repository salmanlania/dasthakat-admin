<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class GenerateMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->view('emails.email_template')
            ->with('data', $this->data);
    }

    public function envelope()
    {
        return new Envelope(
            subject: $this->data['subject'] ?? "",
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        if ($this->data['template'] === "otp-verify-template")
            return new Content(
                view: 'emails.otp-verify-template',
            );
        if ($this->data['template'] === "test-template")
            return new Content(
                view: 'emails.test-template',
            );
    }
}
