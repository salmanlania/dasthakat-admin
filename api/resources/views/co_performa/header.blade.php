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
          <img id="image{{$i}}" src="{{ public_path2('images/logo' . $i . '.png') }}" alt="Logo{{ $i }}" />
        @endfor
      </div>
    
  <div class="invoice-title" style="margin:40px 0px 0px 0px;font-size: 20px;font-weight: bold;"><u>PROFORMA </u></div>

 <table style="margin-bottom: 300px;">
    <tbody>
      <tr>
         <th>Date</th>
        <td class="text-left">{{ \Carbon\Carbon::parse($document_date)->format('d-m-Y') }}</td>
      
        <th>Charge #</th>
        <td class="text-left">{{ $document_identity }}</td>
      
         <th>Event No.</th>
        <td class="text-left">{{ $event['event_code'] ?? '' }}</td>
      </tr>

      <tr>
        <th>Charge #</th>
        <td class="text-left">{{ $customer['name'] ?? '' }}</td>
  
         <th>Location</th>
        <td class="text-left">{{ $port['name'] ?? '' }}</td>

        <th>S.O No.</th>
        <td class="text-left">{{ $service_order['document_identity'] ?? '' }}</td>

      </tr>
     
      <tr>
        <th>Ship To.</th>
        <td class="text-left">{{ $event['event_code'] ?? 'EVENT123' }} - {{ $event['vessel_name'] ?? 'Vessel Name' }}</td>
        <th>Payment.</th>
        <td class="text-left">{{ !empty($ship_date) ? \Carbon\Carbon::parse($ship_date)->format('d-m-Y') : '' }}</td>
        <th>Cust Ref.</th>
        <td class="text-left">{{  '' }}</td>
      </tr>

       <tr>
        <th>Bill To.</th>
        <td colspan="5" class="text-left">{{ $billing_address ?? '1234 Billing Address Lane, Houston, TX' }}</td>
      </tr>
      
    </tbody>
  </table>
</div>
