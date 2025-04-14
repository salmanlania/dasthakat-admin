@php

$order = $orderDetail['order'];
$items = $orderDetail['items'];

@endphp
        <div class="order-details">

            <p><strong>Order Summary</strong></p>
            <p><strong>Order Number : </strong>{{ $order['order_no'] }}</p>
            <p><strong>Order Date : </strong> {{ date('M d,Y',strtotime($order['order_date'])) }}</p>
           <!--  <p><strong>Billing Address : </strong><br> 123 Main St, Suite 100, Cityville, CA 90000</p> -->
            <p><strong>Shipping Address : </strong> {{ $order['address'] }}</p>
        </div>

        <div class="items-table">
            <p><strong>Items Ordered : </strong></p>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Part No</th>
                    <th>Quantity</th>
                </tr>
		@php $total_qty = 0; @endphp
		@foreach($items as $row)
		    @php $total_qty += $row['quantity']; @endphp
                <tr>
                    <td>{{ $row['product_name'] }}</td>
                    <td>{{ $row['part_number'] }}</td>
                    <td>{{ $row['quantity'] }}</td>
                </tr>
		@endforeach
            </table>
        </div>

        <div class="order-details">
            <p><strong>Total Quantity :</strong>{{ $total_qty }}</p>
            <!-- <p><strong>Shipping Method:</strong> Standard Shipping</p> -->
            <!-- <p><strong>Estimated Delivery Date:</strong> November 9, 2024</p> -->
        </div>


