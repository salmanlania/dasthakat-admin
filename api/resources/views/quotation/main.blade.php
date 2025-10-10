<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Proforma-{{ $document_identity ?? "" }}-{{ $vessel['name'] ?? "" }}</title>
    <style>
        @page {
            margin: 2px 40px 10px 40px; 
        }

        body {
              font-family: Times, serif;
            font-size: 12px;
             color: #203272;
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
            bottom: 0px;
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
      width: 85%;
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
  top: 80;
  left: 0;
  right: 0;

  margin-bottom: 50px;


  }

  .div-images img {
    height: 30px;
    object-fit: contain;
    padding-left: 5px;
/*    border: 1px solid #ccc;*/
      }
      #image2{
    height: 15px;
    margin-bottom: 5px;
/*     padding-top: 5px;*/
      }
      #image3{
    height: 25px;
    margin-bottom: 1px;
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
    margin-bottom: 20px;
    float: left;
  }

  .page-break-with-space {
  page-break-before: always;
 }

.page-break-with-space td {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 325px !important;
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
 .text-left{
    text-align: left !important;
 }
 .first{
    width: 140px;
 }


  /* Force a new page for the terms */
    .no-header-footer-page {
        page-break-before: always;
    }


  /* Hide header/footer on this specific page */
    .no-header-footer-page .pdf-header,
    .no-header-footer-page .pdf-footer {
        display: none !important;
    }

    </style>

    @stack('styles')
</head>
<body>

    <header>
        @include('quotation.header')
    </header>

    <footer>
        @include('quotation.footer')
    </footer>

    @yield('content')


   
</body>
</html>
