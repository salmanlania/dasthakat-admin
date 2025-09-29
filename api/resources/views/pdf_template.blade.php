<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PDF Document</title>
    <style>
        @page {
            margin: 20px 40px 100px 40px; 
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12px;
        }

        header {
            position: fixed;
/*            top: -140px;*/
            left: 0;
            right: 0;
            height: 120px;
        }

        footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 50px;
            text-align: center;
            font-size: 10px;
        }
   .header img {
      position: absolute; /* instead of fixed */
      left: 0px;
      top: 10px;
      height: 110px;
      float: left; /* float doesn't work with absolute */
    }

        .page-break {
            page-break-before: always;
        }

   .company-details {
/*      width: 80%;*/
      top:0;
      left:0;
      text-align: center;
      padding: 0px;

    }
    .company-details h2{
      font-size: 28px;
      margin-bottom: 10px;
    }
     .company-details p{
      font-size: 12px;
      margin-top: -11px;
    }

.image-content {
  position: fixed;
  top: 100;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px; /* define fixed height */
  background: white; /* prevent bleed from content */
  text-align: center;
  font-size: 16px;
/*  color: #203272;*/
  z-index: 999;
  margin-top: 10px;
  margin-bottom: 10px;


  }

  .image-content table th{
    width: 55px;
    font-size: 12px;
  }

  .div-images {
    
   

     position: fixed;
  top: 100;
  left: 0;
  right: 0;

  margin-bottom: 100px;


  }

  .div-images img {
    height: 30px;
  }

  .image-content table{

     width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 12px;
      margin-top: 10px;
  }

  .image-content td,th{

     border: 1px solid #747474;
      padding: 6px;
      margin: 0px;
      text-align: center;
    margin-bottom: 200px;
    float: left;
  }

  .page-break-with-space {
  page-break-before: always;
 }

.page-break-with-space td {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 340px !important;
}
.footer{
    font-size: 12px;
}

.page-note::after {
    content: "Page " counter(page);
    font-style: italic;
  }

  .page-note {
      text-align: center;
      font-size: 11px;
      font-style: italic;
      margin-top: 10px;
  }


    </style>

    @stack('styles')
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


<div class="image-content" >
      <div class="div-images">
        @for ($i = 1; $i <= 7; $i++)
          <img src="{{ public_path2('images/logo' . $i . '.png') }}" alt="Logo{{ $i }}" />
        @endfor
      </div>
    
  <div class="invoice-title" style="margin:40px 0px 0px 0px;font-size: 20px;font-weight: bold;"><u>PROFORMA </u></div>

 <table style="margin-bottom: 300px;">
    <tbody>
      <tr>
         <th>Date</th>
        <td>{{ $document_date }}</td>
      
        <th>Charge #</th>
        <td>{{ $document_identity }}</td>
      
         <th>Event No.</th>
        <td>{{ $event['event_code'] ?? '' }}</td>
      </tr>

      <tr>
        <th>Charge #</th>
        <td>{{ $customer['name'] ?? '' }}</td>
  
         <th>Location</th>
        <td>{{ $port['name'] ?? '' }}</td>

        <th>S.O No.</th>
        <td>{{ $service_order['document_identity'] ?? '' }}</td>

      </tr>
     
      <tr>
        <th>Ship To.</th>
        <td >{{ $event['event_code'] ?? 'EVENT123' }} - {{ $event['vessel_name'] ?? 'Vessel Name' }}</td>
        <th>Payment.</th>
        <td>{{ $ship_date ?? '' }}</td>
        <th>Cust Ref.</th>
        <td>{{  '' }}</td>
      </tr>

       <tr>
        <th>Bill To.</th>
        <td colspan="5">{{ $billing_address ?? '1234 Billing Address Lane, Houston, TX' }}</td>
      </tr>
      
    </tbody>
  </table>
</div>




   <table id="detail" >
  <thead>
  
</thead>
  <tbody>

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
    @php
      $total = 0;
      $count = 0;       // line tracker (for wrapped text)
      $all_count = 1;   // actual row index
    @endphp

    @foreach($charge_order_detail as $key => $detail)
      @php
        $productName = $detail['product_description'] ?? '';
        $chunks = array_slice(str_split($productName, 60), 0, 10);
        $rowLines = count($chunks); // how many lines this row takes

        $addBreak = false;
        if ($count + $rowLines >= 20) { // if this row will overflow the 19-line page
          $addBreak = true;
          $count = 0; // reset after break
           $all_count++;
        }

        $count += $rowLines; // accumulate total lines printed
      @endphp

      @if($addBreak)
        <tr class="page-break-with-space">
          <td colspan="9"></td>
        </tr>
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

      @endif

      <tr>
        <td>{{ $key + 1 }}</td>
        <td class="description">
          @foreach($chunks as $value)
            {{ $value }}<br>
          @endforeach
        </td>
        <td>{{ $detail['unit']['name'] ?? '' }}</td>
        <td>{{ $detail['quantity'] }}</td>
        <td>${{ $detail['rate'] }}</td>
        <td>${{ $detail['amount'] }}</td>
        <td>{{ $detail['discount_percent'] }}</td>
        <td>${{ $detail['discount_amount'] }}</td>
        <td>${{ $detail['gross_amount'] }}</td>
      </tr>
    @endforeach


      @php $length = 19  @endphp
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

     <tr>
        <td colspan="3">Total</td>
        <td>34,000.00</td>
        <td>34,000.00</td>
        <td>34,000.00</td>
        <td>34,000.00</td>
        <td>34,000.00</td>
        <td>34,000.00</td>
      </tr>
  </tbody>
</table>

</body>
</html>
