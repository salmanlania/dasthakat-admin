<?php
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendRFQMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $link;

    public function __construct($data, $link)
    {
        $this->data = $data;
        $this->link = $link;
    }

    public function build()
    {
        return $this->subject('Request for Quotation')
            ->view('emails.rfq_mail')
            ->with([
                'data' => $this->data,
                'link' => $this->link
            ]);
    }
}
