import { Button, Col, DatePicker, Row, Select } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  FaArrowDown,
  FaArrowUp,
  FaDollarSign,
  FaReceipt,
} from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import GMSLogo from "../../assets/logo-with-title.png";
import DashboardCard from "../../components/Card/DashboardCard";
import PageHeading from "../../components/heading/PageHeading";

const shortcuts = [
  { title: "Chart of Accounts" },
  { title: "Sales Invoice" },
  { title: "Purchase Invoice" },
  { title: "Journal Entry" },
  { title: "Payment Entry" },
  { title: "Accounts Receivable" },
  { title: "General Ledger" },
  { title: "Trial Balance" },
];

const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const GeneratePDF = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setTextColor(32, 50, 114); //

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Global Marine Safety - America", pageWidth / 2, 12, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("9145 Wallisville Rd, Houston TX 77029, USA", pageWidth / 2, 18, {
      align: "center",
    });
    doc.text(
      "Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com",
      pageWidth / 2,
      22,
      {
        align: "center",
      }
    );

    // Header LOGO
    doc.addImage(GMSLogo, "PNG", 8, 1, 35, 26);

    // Bill To and Ship To
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 5, 40);
    doc.text("Ship To", 140, 40);
    doc.setFont("helvetica", "normal");
    doc.text("FLEET SHIP MANAGEMENT", 5, 45);
    doc.text("FLEET", 140, 45);

    // Estimate Details
    doc.text("Estimate", 5, 60);
    doc.text("Quote Date: 11/1/2024", 5, 70);
    doc.text("Quote Number: 11012024-1", 5, 75);
    doc.text("Customer's Reference: 1234", 5, 80);
    doc.text("Delivery Location: Houston", 5, 85);
    doc.text("Payment Terms: Net 30", 5, 90);
    doc.text("Flag: MHL", 5, 95);
    doc.text("Class: ABS", 5, 100);
    doc.text("ETA: TBA", 5, 105);

    // Table Data
    const tableColumn = [
      "S. No",
      "Description",
      "UOM",
      "QTY",
      "Price per Unit",
      "Gross Amount",
      "Discount %",
      "Net Amount",
    ];
    const tableRows = [
      [
        "1",
        "Annual Inspection of Portable Fire Extinguisher",
        "EA",
        "10",
        "$5.50",
        "$55.00",
        "10%",
        "$49.50",
      ],
      [
        "2",
        "Annual Inspection of Semi - Portable Fire Extinguisher",
        "EA",
        "2",
        "$25.00",
        "$50.00",
        "10%",
        "$45.00",
      ],
      [
        "3",
        "Annual Inspection of Foam Applicator",
        "EA",
        "1",
        "$25.00",
        "$25.00",
        "10%",
        "$22.50",
      ],
      [
        "4",
        "Air quality test",
        "EA",
        "1",
        "$150.00",
        "$150.00",
        "10%",
        "$135.00",
      ],
      [
        "5",
        "Annual Inspection of Immersion suit",
        "EA",
        "4",
        "$20.00",
        "$80.00",
        "10%",
        "$72.00",
      ],
      [
        "6",
        "Annual Inspection of Fireman suit",
        "EA",
        "8",
        "$20.00",
        "$160.00",
        "10%",
        "$144.00",
      ],
      [
        "7",
        "Annual Inspection of Chemical suit",
        "EA",
        "2",
        "$20.00",
        "$40.00",
        "10%",
        "$36.00",
      ],
      [
        "8",
        "Annual Inspection of Inflatable Life Jackets",
        "EA",
        "10",
        "$20.00",
        "$200.00",
        "10%",
        "$180.00",
      ],
      [
        "9",
        "Calibration of Portable gas detectors",
        "EA",
        "1",
        "$135.00",
        "$135.00",
        "10%",
        "$121.50",
      ],
      [
        "10",
        "Calibration of Alcohol meters",
        "EA",
        "1",
        "$85.00",
        "$85.00",
        "10%",
        "$76.50",
      ],
      [
        "11",
        "Calibration of Fixed Gas Detection System",
        "EA",
        "2",
        "$550.00",
        "$1,100.00",
        "10%",
        "$990.00",
      ],
      [
        "12",
        "Calibration of Thermometer",
        "EA",
        "1",
        "$45.00",
        "$45.00",
        "10%",
        "$40.50",
      ],
      [
        "13",
        "Supply of Labels - as needed",
        "EA",
        "1",
        "$0.50",
        "$0.50",
        "0%",
        "$0.50",
      ],
      [
        "14",
        "Supply of Seals - as needed",
        "EA",
        "1",
        "$0.20",
        "$0.20",
        "0%",
        "$0.20",
      ],
      [
        "15",
        "Travel within Houston - per trip",
        "TRIP",
        "1",
        "$125.00",
        "$125.00",
        "0%",
        "$125.00",
      ],
    ];

    // Adding Table
    doc.autoTable({
      startY: 110,
      head: [tableColumn],
      body: tableRows,
    });

    // Notes
    doc.text("Notes:", 10, doc.previousAutoTable.finalY + 10);
    doc.text(
      "Availability of technician can only be confirmed once we have firm attendance date. Discount offered is only valid for service items, excluding logistics and overtime.",
      10,
      doc.previousAutoTable.finalY + 15
    );

    // Grand Total
    doc.text("Grand Total: $2,038.20", 10, doc.previousAutoTable.finalY + 30);

    // Footer
    doc.text(
      "Remit Payment to: Global Marine Safety Service Inc",
      10,
      doc.previousAutoTable.finalY + 40
    );
    doc.text(
      "Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44",
      10,
      doc.previousAutoTable.finalY + 45
    );

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <Button type="primary" onClick={generatePDF}>
      Download Quotation PDF
    </Button>
  );
};

const Dashboard = () => {
  return (
    <>
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <PageHeading>DASHBOARD</PageHeading>
        <GeneratePDF />

        <div className="flex items-center gap-2">
          <DatePicker picker="year" />
          <Select
            options={months}
            className="w-40"
            placeholder="Select Month"
            optionFilterProp="label"
            showSearch
            allowClear
          />
        </div>
      </div>

      <Row gutter={[12, 12]} className="mt-4">
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Total Sales"
            value="$10,000"
            icon={<FaDollarSign size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Total Purchases"
            value="$5,000"
            icon={<FaReceipt size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Incoming Payment"
            value="$7,000"
            icon={<FaArrowDown size={24} className="text-primary" />}
          />
        </Col>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            title="Outgoing Payment"
            value="$8,000"
            icon={<FaArrowUp size={24} className="text-primary" />}
          />
        </Col>
      </Row>

      <div className="bg-white rounded-md shadow-sm p-4 mt-4 w-full">
        <h4 className="text-lg">Shortcuts</h4>
        <Row gutter={[12, 12]} className="mt-4">
          {shortcuts.map(({ title }, i) => (
            <Col span={24} lg={6} md={8} sm={12} key={i}>
              <div className="hover:border-b w-fit transition-all h-6 hover:border-gray-400 flex gap-1 items-center cursor-pointer text-gray-600 text-sm">
                <span>{title}</span>
                <GoArrowUpRight size={16} />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
