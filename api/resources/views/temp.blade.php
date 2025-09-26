@extends('main')

@push('styles')
  <style>
   #detail{
    margin-top: 340px;
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
    }
    tr{
/*       border-bottom: 1px solid #747474 !important;*/
    }
  </style>
@endpush

@section('content')
  
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
       $productName = isset($detail['product_description']) ? mb_strimwidth($detail['product_description'], 0, 80, '') : '';
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

@endsection