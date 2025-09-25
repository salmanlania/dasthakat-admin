@extends('co_performa.main')

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
    <th>S. No </th>
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
      $qty = 0;
      $disc_amount = 0;
      $net_amount = 0;
      $gross_amount = 0;
      $total = 0;
      $count = 0;       // line tracker (for wrapped text)
      $all_count = 1;   // actual row index
    @endphp

    @foreach($charge_order_detail as $key => $detail)
      @php
        $productName = $detail['product_description'] ?? '';
        $chunks = array_slice(str_split($productName, 60), 0, 10);
        $rowLines = count($chunks); // how many lines this row takes
        $qty+=$detail['quantity'];
        $gross_amount+=$detail['amount'];
        $disc_amount+=$detail['discount_amount'];
        $net_amount+=$detail['gross_amount'];

        $addBreak = false;
        if ($count + $rowLines >= 22) { // if this row will overflow the 19-line page
          $addBreak = true;
          $count = 0; // reset after break
           $all_count++;
        }

        $count += $rowLines; // accumulate total lines printed
      @endphp

      @if($addBreak)
      <tr>
     <td colspan="9" style="padding-top:20px;font-size: 1rem;border:none;"> Continue to next page ...</td>
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


      @php $length = 21  @endphp
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
        <th colspan="3">Total</th>
        <th>{{$qty}}</th>
        <th></th>
        <th>${{$gross_amount}}</th>
        <th></th>
        <th>${{$disc_amount}}</th>
        <th>${{$net_amount}}</th>
      </tr>
  </tbody>
</table>

@endsection