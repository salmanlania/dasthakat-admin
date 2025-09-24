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
