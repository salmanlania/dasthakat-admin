@extends('quotation.main')

@push('styles')
  <style>
   #detail{
    margin-top: 325px;
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
      padding: 2px;
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
.total_amount_row th{
  border: 1.5px solid #203272 !important;
}

  </style>
@endpush

@php

if(!empty($term_desc)){
  $lines = explode("\n", $term_desc);
  $term_desc =[];
    foreach ($lines as $line) {
      $line = trim($line);
      $term_desc[]= wordwrap($line, 80, "\n");
    
  }
}else{
  $term_desc = [];
}
$termCount = (!empty($term_desc) ? (count($term_desc)>2 ? 3  : count($term_desc) ) : 0 );
@endphp

@section('content')
  
 <table id="detail" >
  <thead>
  
</thead>
  <tbody>

    <tr>
    <th width="5%">S.No</th>
    <th width="40%">Description</th>
    <th width="10">UOM</th>
    <th width="8%">QTY</th>
    <th width="10%">Price per Unit</th>
    <th width="10%">Gross Amount</th>
    <th width="5%">Disc %</th>
    <th width="8%">Discount Amount</th>
    <th  width="18%">Net Amount</th>
  </tr>
    @php
    $next = 0;
      $qty = 0;
      $disc_amount = 0;
      $net_amount = 0;
      $gross_amount = 0;
      $total = 0;
      $count = 0;       // line tracker (for wrapped text)
      $all_count = 1;   // actual row index
    @endphp

    @foreach($quotation_detail as $key => $detail)

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

        if ( $count >=  30) { 
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
              <th >Description</th>
              <th>UOM</th>
              <th>QTY</th>
              <th>Price per Unit</th>
              <th>Gross Amount</th>
              <th>Disc %</th>
              <th>Discount Amount</th>
              <th>Net Amount</th>
            </tr>

      @endif


       @php 

        $remain = 31 - $count;  
        $rows = (count($chunks)>$remain) ? count($chunks)-$remain : count($chunks);

        $next = (count($chunks)>$remain) ? count($chunks)-$remain : 0;

        @endphp

        <tr>
        <td rowspan="{{ $rows  }}">{{ $key + 1 }}</td>
        <td class="description {{ $count!=30 ? $add_class : ''}}" >
          {{ $value }}
        </td>
       


        <td rowspan="{{ $rows  }}">{{ $detail['unit']['name'] ?? '' }}</td>
        <td rowspan="{{ $rows  }}" style="text-align: center; vertical-align: middle;" class="text-center">{{ $detail['quantity'] }}</td>
        <td rowspan="{{ $rows  }}" class="text-right">${{ $detail['rate'] }}</td>
        <td rowspan="{{ $rows  }}" class="text-right">${{ $detail['amount'] }}</td>
        <td rowspan="{{ $rows  }}" class="">{{ $detail['discount_percent'] }}</td>
        <td rowspan="{{ $rows  }}" class="text-right">${{ $detail['discount_amount'] }}</td>
        <td rowspan="{{ $rows  }}" style="" class="text-right">
      
        ${{ $detail['gross_amount'] }}
      </td>
      </tr>

      @else

        @php
           $addBreak = false;
        if ($count >= 30) { 
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
         @if($next!=0)
          <td rowspan="{{ $next  }}"></td>
         @endif

          <td class="description {{ ($count==30 || count($chunks)-1==$k) ? 'top' : 'top-bottom' }}" >
            {{ $value }}
          </td>


           @if($next!=0)
             <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
              <td rowspan="{{ $next  }}"></td>
            </tr>
            @endif





    @endif
    @endforeach
    @endforeach
      @php $length = 30 -count($term_desc); 
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

     <tr class="total_amount_row">
        <th colspan="3">Total</th>
        <th colspan="3" class=" text-right">${{$gross_amount}}</th>
        <th colspan="2" class="  text-right">${{$disc_amount}}</th>
        <th class=" text-right">${{$net_amount}}</th>
      </tr>



    @php 
    $i=0; 

    $all_tds = $count+ $emtyRows;
    $all_tds = 32-$all_tds;
    @endphp

    @foreach($term_desc as $key =>  $desc)

     @if($emtyRows <= 3  && count($term_desc)+$count != 31 && (($key==$all_tds && $all_tds < 4) || $key==3))
      <tr class="page-break-with-space">
          <td colspan="9"></td>
      </tr>
       @php $i=0; @endphp

     @endif

      <tr>
        @if($i==0)
          @if($emtyRows<= 3 && count($term_desc)+$count != 31)

        <td rowspan="{{ $key == 0 ? ( $all_tds <4 ? $all_tds : 3 ) : ( ($all_tds < 4) ? count($term_desc)-($all_tds) : count($term_desc)-3 ) }}" colspan="1" class="text-center">Note.</td>
          @else 
            <td rowspan="{{ count($term_desc) }}" colspan="1" class="text-center">Note.</td>
          @endif


        @endif
        <td colspan="8" class="text-left">{{ $desc }} </td>

         @php $i++; @endphp
      </tr>
    @endforeach


  </tbody>
</table>



@php
function str_split_word($remarks){
$words = explode(' ', $remarks);

$chunks = [];
$chunk = '';
foreach ($words as $word) {
    // Check if adding the next word exceeds 45 characters
    if (strlen($chunk . ' ' . $word) > 40) {
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