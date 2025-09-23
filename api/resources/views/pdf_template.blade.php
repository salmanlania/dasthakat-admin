<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Proforma Invoice</title>
  <style>
    body {
      font-family: "Times New Roman", Times, serif;
      color: #203272;
      margin: 0;
      
/*      padding: 40px 20px;*/
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header img {
      float: left;
      height: 60px;
    }

    .company-details {
      text-align: center;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      margin: 40px 0 10px;
      text-align: center;
      position: relative;
    }

    .invoice-title::after {
      content: "";
      display: block;
      width: 100px;
      height: 2px;
      background-color: #203272;
      margin: 5px auto 0;
    }

    .addresses {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .address-box {
      width: 45%;
      font-size: 12px;
    }

    .address-title {
      font-weight: bold;
      margin-bottom: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 12px;
    }

    table thead {
      background-color: #ddd9c4;
      color: #203272;
    }

    th, td {
      border: 1px solid #747474;
      padding: 6px;
      margin: 0px;
      text-align: center;
    }

    td.description {
      text-align: left;
    }
    tr{
/*       border-bottom: 1px solid #747474 !important;*/
    }

    .note-section {
      margin-top: 20px;
      font-size: 12px;
    }

    .note-section p {
      margin: 8px 0;
    }

    .bold {
      font-weight: bold;
    }

    .italic {
      font-style: italic;
    }

  .page-note {
      text-align: center;
      font-size: 11px;
      font-style: italic;
      margin-top: 10px;
  }
  .total-row td {
      font-weight: bold;
      font-size: 13px;

  }

  @page {
    margin: 50px 30px 80px 30px;
  }
  .page-break-before {
    page-break-before: always;
    break-before: page;
  }

  .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px; /* define fixed height */
  background: white; /* prevent bleed from content */
  text-align: center;
  font-size: 16px;
  color: #203272;
  z-index: 999;
  margin-top: 0px;

  }



  .footer-images {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
         margin-top: 0px;

  }

  .footer-images img {
    height: 50px;
  }

  .page-note::after {
    content: "Page " counter(page);
    font-style: italic;
  }



  </style>
</head>
<body>

  <div class="header">
    <img src="{{ public_path2('images/logo-with-title.png') }}" alt="Company Logo" />
    <div class="company-details">
      <h2>Global Marine Safety - America</h2>
      <p>9145 Wallisville Rd, Houston TX 77029, USA</p>
      <p>Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com</p>
    </div>
  </div>

  <div class="addresses">
    <div class="address-box">
      <div class="address-title">Bill To</div>
      <div>{{ $billing_address ?? '1234 Billing Address Lane, Houston, TX' }}</div>
    </div>
    <div class="address-box">
      <div class="address-title">Ship To</div>
      <div>{{ $event['event_code'] ?? 'EVENT123' }} - {{ $event['vessel_name'] ?? 'Vessel Name' }}</div>
    </div>
  </div>

  <div class="invoice-title">PROFORMA</div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Charge #</th>
        <th>Event No.</th>
        <th>Customer's Ref</th>
        <th>Delivery Location</th>
        <th>S.O No.</th>
        <th>Payment Terms</th>
        <th>Ship Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ $document_date }}</td>
        <td>{{ $document_identity }}</td>
        <td>{{ $event['event_code'] ?? '' }}</td>
        <td>{{ $port['name'] ?? '' }}</td>
        <td>{{ $service_order['document_identity'] ?? '' }}</td>
        <td>{{ $payment_terms ?? '' }}</td>
        <td>{{ $ship_date ?? '' }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>S. No</th>
        <th>Description</th>
        <th>UOM</th>
        <th>QTY</th>
        <th>Price per Unit</th>
        <th>Gross Amount</th>
        <th>Discount %</th>
        <th>Discount Amount</th>
        <th>Net Amount</th>
      </tr>
    </thead>
    <tbody>
      @php
        $total = 0;
        $count = 0;
        $all_count = 1;
      @endphp

      @foreach($charge_order_detail as $key => $detail)
        @php
          $total += $detail['gross_amount'];
          $productName = $detail['product_description'] ?? '';
          $chunks = str_split($productName, 60);
          $chunks = array_slice($chunks, 0, 10); // Limit to 10 lines


        @endphp



         @php 
         $class = '';
         $length = ($all_count!=1) ? 37 : 14;
         if($count>=$length) {
            $count =0;
            $class = 'page-break-before' ;
            $all_count++;
        }  @endphp

        @if($count==0 && $key!=0)
          <tr style="border: 1px solid white !important;"  >
          <td colspan="9" style="border: 0px solid red  !important;  ;">
            <div class="footer">
            <div class="footer-images">
              @for ($i = 1; $i <= 7; $i++)
                <img src="{{ public_path2('images/logo' . $i . '.png') }}" alt="Logo{{ $i }}" />
              @endfor
            </div>
            <div class="page-note"></div>
          </div>
          </td>
        </tr>
        @endif



        <tr class="{{$class}}">
          <td>{{ $key+1 }}</td>
          <td class="description">

          @foreach($chunks as $value)
               {{ $value }}
               @php $count++  @endphp
               

          @endforeach


        </td>
          <td>{{ $detail['unit']['name'] ?? '' }}</td>
          <td>{{ $detail['quantity'] }}</td>
          <td>{{ $detail['rate'] }}</td>
          <td>{{ $detail['amount'] }}</td>
          <td>{{ $detail['discount_percent'] }}</td>
          <td>{{ $detail['discount_amount'] }}</td>
          <td>{{ $detail['gross_amount'] }}</td>
        </tr>
      @endforeach
 

       @php $length = ($all_count!=1) ? 27 : 14  @endphp

      @for($i = $count; $i < $length; $i++)




       
        <tr class="">
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
        </tr>
      @endfor

      <tr class="total-row">
        <td colspan="6">
          Remit Payment to: Global Marine Safety Service Inc<br/>
          Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44
        </td>
        <td colspan="2">USD Total:</td>
        <td>${{ number_format($total, 2) }}</td>
      </tr>

      <tr>
        <td colspan="9" class="italic">
          Note: Any invoice discrepancies must be reported prior to invoice due date. Please arrange payment in full by due date to avoid any late fee or charges. Appropriate wire fee must be included to avoid short payment.
        </td>
      </tr>
    </tbody>
  </table>

<!-- <htmlpagefooter name="myFooter"> -->
  <div class="footer">
    <div class="footer-images">
      @for ($i = 1; $i <= 7; $i++)
        <img src="{{ public_path2('images/logo' . $i . '.png') }}" alt="Logo{{ $i }}" />
      @endfor
    </div>
    <div class="page-note"></div>
  </div>
  <!-- </htmlpagefooter> -->



<!-- <sethtmlpagefooter name="myFooter" value="on" /> -->

</body>
</html>
