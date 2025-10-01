@extends('sale_invoice.main')

@push('styles')
  <style>
   #detail{
    margin-top: 320px;
    color: #203272;
       font-family:  Times, serif;
   }
     table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 12px;
      margin-top: 10px;
    }

    table thead {
/*      background-color: #ddd9c4;*/
/*      color: #203272;*/
    }

    th, td {
      border: 1px solid #747474;
      padding: 6px;
      margin: 0px;
      text-align: center;
    }

    td.description {
      text-align: left;
      width: 40%;
    }
    tr{
/*       border-bottom: 1px solid #747474 !important;*/
    }
    .text-right{
    text-align: right !important;
   }

   .description .line {
  padding: 3px 0;   /* vertical padding */
  margin: 1px 0;    /* optional vertical margin between lines */
}

.bottom{
  border-bottom: 1px solid white !important;
}
.top{
  border-top: 1px solid white !important;*/
}

.top-bottom{
  border-bottom: 1px solid white !important;
  border-top: 1px solid white !important;
}
  </style>
@endpush

@section('content')


 <table id="detail" >
  <thead>
  
</thead>
  <tbody>

    <tr>
    <th>S. No </th>
    <th>Description</th>
    <th>UOM</th>
    <th>QTY</th>
    <th>Price per Unit</th>
    <th>Gross Amount</th>
    <th>Disc %</th>
    <th>Discount Amount</th>
    <th>Net Amount</th>
  </tr>
    @php
      $qty = 0;
      $disc_amount = 0;
      $net_amount = 0;
      $gross_amount = 0;
      $total = 0;
      $count = 0;       // line tracker (for wrapped text)
      $all_count = 1;   // actual row index
    @endphp

    @foreach($sale_invoice_detail as $key => $detail)

      @php
        $productName = $detail['product_description'] ?? '';
        $chunks = str_split_word($productName);
       
        $qty+=$detail['quantity'];
        $gross_amount+=$detail['amount'];
        $disc_amount+=$detail['discount_amount'];
        $net_amount+=$detail['gross_amount'];
        $add_class = count($chunks) > 1 ? 'bottom' : '';
    @endphp

    
      @foreach($chunks as $k => $value)

      @if($k==0)
      @php
           $addBreak = false;

        if ($count >=  22) { 
          $addBreak = true;
          $count = 0; // reset after break
           $all_count++;
        }

        $count ++;
      @endphp

      @if($addBreak)
      <tr>
     <td colspan="9" style="padding-top:16px;font-size: 1rem;border:none;"> Continue to next page ...</td>
</tr>
        <tr class="page-break-with-space">
          <td colspan="9"></td>
        </tr>
          <tr style="margin-top:10px !important">
              <th>S. No</th>
              <th>Description</th>
              <th>UOM</th>
              <th>QTY</th>
              <th>Price per Unit</th>
              <th>Gross Amount</th>
              <th>Disc %</th>
              <th>Discount Amount</th>
              <th>Net Amount</th>
            </tr>

      @endif
        <tr>
        <td class="{{ $count!=23 ? $add_class : ''}} ">{{ $key + 1 }}</td>
        <td class="description {{ $count!=23 ? $add_class : ''}}">
          {{ $value }}
        </td>
        <td class="{{ $count!=23 ? $add_class : ''}}">{{ $detail['unit']['name'] ?? '' }}</td>
        <td class="text-right {{  $count!=23 ? $add_class : ''}}">{{ $detail['quantity'] }}</td>
        <td class="text-right {{  $count!=23 ? $add_class : ''}}">${{ $detail['rate'] }}</td>
        <td class="text-right {{  $count!=23 ? $add_class : ''}}">${{ $detail['amount'] }}</td>
        <td class="{{  $count!=23 ? $add_class : ''}}">{{ $detail['discount_percent'] }}</td>
        <td class="text-right {{  $count!=23 ? $add_class : ''}}">${{ $detail['discount_amount'] }}</td>
        <td class="text-right {{  $count!=23 ? $add_class : ''}}">${{ $detail['gross_amount'] }}</td>
      </tr>

      @else

        @php
           $addBreak = false;
        if ($count >= 22) { 
          $addBreak = true;
          $count = 0; // reset after break
           $all_count++;
        }

        $count ++;
      @endphp

      @if($addBreak)
      <tr>
          <td colspan="9" style="padding-top:16px;font-size: 1rem;border:none;"> Continue to next page ...</td>
      </tr>
        <tr class="page-break-with-space">
          <td colspan="9"></td>
        </tr>
          <tr style="margin-top:10px !important">
              <th>S. No</th>
              <th>Description</th>
              <th>UOM</th>
              <th>QTY</th>
              <th>Price per Unit</th>
              <th>Gross Amount</th>
              <th>Disc %</th>
              <th>Discount Amount</th>
              <th>Net Amount</th>
            </tr>

      @endif
      <tr>
        <td class="{{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="description {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}" >
          {{ $value }}
        </td>
        <td class="{{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="text-right {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="text-right {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="text-right {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="{{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="text-right {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
        <td class="text-right {{ ($count==23 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}"></td>
      </tr>

      @endif
       @endforeach
    @endforeach
      @php $length = 22; 
      $emtyRows = 0;
      @endphp
      @for($i = $count; $i < $length; $i++)

      @php  $emtyRows++; @endphp
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
        <th colspan="3">Total</th>
        <th class="text-right">{{$qty}}</th>
        <th></th>
        <th class="text-right">${{$gross_amount}}</th>
        <th></th>
        <th class="text-right">${{$disc_amount}}</th>
        <th class="text-right">${{$net_amount}}</th>
      </tr>

  </tbody>
</table>



@php
function str_split_word($remarks){
$words = explode(' ', $remarks);

$chunks = [];
$chunk = '';
foreach ($words as $word) {
    // Check if adding the next word exceeds 45 characters
    if (strlen($chunk . ' ' . $word) > 50) {
        $chunks[] = trim($chunk); // Add the current chunk to result
        $chunk = $word; // Start a new chunk
    } else {
        $chunk .= ' ' . $word;
    }
}

// Add the last chunk if not empty
if (!empty($chunk)) {
    $chunks[] = trim($chunk);
}

// Limit to 10 chunks if needed
$chunks = array_slice($chunks, 0, 10);
return $chunks;
}

@endphp


@endsection