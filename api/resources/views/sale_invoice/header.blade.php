<div class="header">
  <img src="{{ public_path2('images/logo-with-title.png') }}" alt="Company Logo" />
  <div class="company-details">
    <h2>Global Marine Safety - America</h2>
    <p>9145 Wallisville Rd, Houston TX 77029, USA</p>
    <p>Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com</p>
  </div>
</div>


<div class="image-content" >
      <div class="div-images" style="border-bottom: 2px solid #2f3960 ;">
        @for ($i = 1; $i <= 7; $i++)
          <img id="image{{$i}}" src="{{ public_path2('images/logo' . $i . '.png') }}" alt="Logo{{ $i }}" />
        @endfor
      
      </div>


  
  <div class="invoice-title" style="margin:10px 0px 0px 0px;font-size: 20px;font-weight: bold;"><u>SALE INVOICE </u></div>

 <table style="margin-bottom: 300px;">
    <tbody>
      <tr>
         <th> Date</th>
        <td class="text-left first">{{ \Carbon\Carbon::parse($document_date)->format('m-d-Y') }}</td>
      
        <th>Invoice  #</th>
        <td class="text-left first">{{ $document_identity ?? "" }}</td>
      
         <th>Event No.</th>
        <td class="text-left first">{{ $event['event_code'] ?? '' }}</td>
      </tr>

      <tr>
        <th>Cust Ref #</th>
        <td class="text-left first">{{ $customer_po_no ?? '' }}</td>
  
         <th>Location</th>
        <td class="text-left first">{{ $port['name'] ?? '' }}</td>

        <th>Payment.</th>
        <td class="text-left first">{{ isset($quotation['payment']) ? $quotation['payment']['name'] : '' }}</td>

      </tr>
     
      <tr>
        <th>Ship To.</th>
        <td class="text-left first">{{ $vessel['name'] ?? '' }}</td>
        <th>Charge #.</th>
        <td class="text-left first">{{ ''  }}</td>
       
        <th>Ship date.</th>
        <td class="text-left">
          @php
            $formattedShipDate = '';
            $ship_date = @$service_date ?? "";

            if (!empty(@$ship_date)) {
                if ($ship_date == '0000-00-00') {
                    $formattedShipDate = 'TBA';
                } else {
                    try {
                        $formattedShipDate = \Carbon\Carbon::parse($ship_date)->format('m-d-Y');
                    } catch (\Exception $e) {
                        $formattedShipDate = '';
                    }
                }
            }
            echo  $formattedShipDate;
        @endphp
        </td>
      </tr>

       <tr>
        <th>Bill To.</th>
        <td colspan="5" class="text-left">{{ $vessel['billing_address'] ?? '' }}</td>
      </tr>
      
    </tbody>
  </table>
</div>
