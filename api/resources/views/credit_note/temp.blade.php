@extends('credit_note.main')

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
    <th>Sale Invoice Amount</th>
    <th>Credit %</th>
    <th>Credit Amount</th>
  </tr>

   @php
      $remarks = $remarks ?? '';
      $chunks = str_split_word($remarks);
    @endphp

      <tr>
        <td >1</td>
        <td width="45%" class="text-left">{{ $remarks ?? ''}}</td>
        <td  width="18%" class="text-right">${{ $sale_invoice['net_amount'] }}</td>          
        <td  width="15%" >{{ $credit_percent }}</td>
        <td  width="15%" class="text-right ">${{ $credit_amount }}</td>
      </tr>
    
      @for($i = 0; $i < 23 - count($chunks); $i++)
        <tr class="">
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
        </tr>
      @endfor
      <tr >
        <th class="total_amount_row" colspan="2">Total</th>
        <th class="total_amount_row text-right">${{ $sale_invoice['net_amount'] }}</th>
        <th class="total_amount_row text-right"></th>
        <th class="total_amount_row text-right">${{$credit_amount}}</th>
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
    if (strlen($chunk . ' ' . $word) > 65) {
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


<!-- @endsection -->