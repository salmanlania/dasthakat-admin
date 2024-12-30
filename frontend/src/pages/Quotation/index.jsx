import {
  Breadcrumb,
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegFilePdf } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { HiRefresh } from "react-icons/hi";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import GMSLogo from "../../assets/logo-with-title.png";
import AsyncSelect from "../../components/AsyncSelect";
import PageHeading from "../../components/heading/PageHeading";
import ChargeOrderModal from "../../components/Modals/ChargeOrderModal";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import { setChargeQuotationID } from "../../store/features/chargeOrderSlice";
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getQuotationList,
  setQuotationDeleteIDs,
  setQuotationListParams,
} from "../../store/features/quotationSlice";

const Quotation = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
  } = useSelector((state) => state.quotation);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date
      ? dayjs(params.document_date).format("YYYY-MM-DD")
      : null,
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      toast.success("Quotation deleted successfully");
      dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success("Quotations deleted successfully");
      closeDeleteModal();
      await dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printQuotation = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setTextColor(32, 50, 114);

    const sideMargin = 4;

    // Header
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("Global Marine Safety - America", pageWidth / 2, 12, {
      align: "center",
    });
    doc.setFont("times", "normal");
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
    doc.setFont("times", "bold");
    doc.text("Bill To", sideMargin, 40);
    doc.text("Ship To", 140, 40);
    doc.setFont("times", "normal");
    doc.text("FLEET SHIP MANAGEMENT", sideMargin, 45);
    doc.text("FLEET", 140, 45);

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("ESTIMATE", pageWidth / 2, 58, {
      align: "center",
    });
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    // Table 1
    const table1Column = [
      "Quote Date",
      "Quote Number",
      "Customer's Reference",
      "Delivery Location",
      "Payment Terms",
      "Flag",
      "Class",
      "ETA",
    ];
    const table1Rows = [
      [
        "11/1/2024",
        "11012024-1",
        "1234",
        "Houston",
        "Net 30",
        "MHL",
        "ABS",
        "TBA",
      ],
    ];

    doc.autoTable({
      startY: 62,
      head: [table1Column],
      body: table1Rows,
      margin: { left: sideMargin, right: sideMargin },
      headStyles: {
        fontSize: 8,
        fontStyle: "bold",
        textColor: [32, 50, 114],
        fillColor: [221, 217, 196],
      },
      styles: {
        lineWidth: 0.1,
        lineColor: [116, 116, 116],
      },
      bodyStyles: {
        textColor: [32, 50, 114],
        fillColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 21 },
        1: { cellWidth: 24 },
        2: { cellWidth: 35 },
        3: { cellWidth: 28 },
        4: { cellWidth: 25 },
        5: { cellWidth: 23 },
        6: { cellWidth: 21 },
        7: { cellWidth: 25 },
      },
    });

    // Table 2
    const table2Column = [
      "S. No",
      "Description",
      "UOM",
      "QTY",
      "Price per Unit",
      "Gross Amount",
      "Discount %",
      "Net Amount",
    ];
    const table2Rows = [
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
        "Annual Inspection of Portable Fire Extinguisher",
        "EA",
        "10",
        "$5.50",
        "$55.00",
        "10%",
        "$49.50",
      ],
      [
        "3",
        "Annual Inspection of Portable Fire Extinguisher",
        "EA",
        "10",
        "$5.50",
        "$55.00",
        "10%",
        "$49.50",
      ],
      [
        "4",
        "Annual Inspection of Portable Fire Extinguisher",
        "EA",
        "10",
        "$5.50",
        "$55.00",
        "10%",
        "$49.50",
      ],
    ];

    // Adding Table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY,
      head: [table2Column],
      body: table2Rows,
      margin: { left: sideMargin, right: sideMargin },
      headStyles: {
        fontSize: 8,
        fontStyle: "bold",
        textColor: [32, 50, 114],
        fillColor: [221, 217, 196],
      },
      styles: {
        lineWidth: 0.1,
        lineColor: [116, 116, 116],
      },
      bodyStyles: {
        textColor: [32, 50, 114],
        fillColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 65 },
        2: { cellWidth: 14 },
        3: { cellWidth: 14 },
        4: { cellWidth: 25 },
        5: { cellWidth: 23 },
        6: { cellWidth: 21 },
        7: { cellWidth: 25 },
      },
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
    const pdfUrl = URL.createObjectURL(pdfBlob, {});
    window.open(pdfUrl, "_blank");
  };

  const columns = [
    {
      title: (
        <div>
          <p>Quotation Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) =>
                dispatch(setQuotationListParams({ document_date: date }))
              }
              format="DD-MM-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: "document_date",
      key: "document_date",
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format("DD-MM-YYYY") : null,
    },
    {
      title: (
        <div>
          <p>Quotation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(
                setQuotationListParams({ document_identity: e.target.value })
              )
            }
          />
        </div>
      ),
      dataIndex: "document_identity",
      key: "document_identity",
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Customer</p>
          <AsyncSelect
            endpoint="/customer"
            size="small"
            className="w-full font-normal"
            valueKey="customer_id"
            labelKey="name"
            value={params.customer_id}
            onChange={(value) =>
              dispatch(setQuotationListParams({ customer_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessel</p>
          <AsyncSelect
            endpoint="/vessel"
            size="small"
            className="w-full font-normal"
            valueKey="vessel_id"
            labelKey="name"
            value={params.vessel_id}
            onChange={(value) =>
              dispatch(setQuotationListParams({ vessel_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "vessel_name",
      key: "vessel_name",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) =>
              dispatch(setQuotationListParams({ event_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "event_code",
      key: "event_code",
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        dayjs(created_at).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { quotation_id }) => (
        <div className="flex flex-col justify-center gap-1 items-center">
          <div className="flex items-center gap-1">
            <Tooltip title="Print">
              <Button
                size="small"
                type="primary"
                className="bg-rose-600 hover:!bg-rose-500"
                icon={<FaRegFilePdf size={14} />}
                onClick={printQuotation}
              />
            </Tooltip>
            <Tooltip title="Charge Order">
              <Button
                size="small"
                type="primary"
                onClick={() => dispatch(setChargeQuotationID(quotation_id))}
                icon={<HiRefresh size={14} />}
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            {permissions.edit ? (
              <Tooltip title="Edit">
                <Link to={`/quotation/edit/${quotation_id}`}>
                  <Button
                    size="small"
                    type="primary"
                    className="bg-gray-500 hover:!bg-gray-400"
                    icon={<MdOutlineEdit size={14} />}
                  />
                </Link>
              </Tooltip>
            ) : null}
            {permissions.delete ? (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete?"
                  description="After deleting, You will not be able to recover it."
                  okButtonProps={{ danger: true }}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onQuotationDelete(quotation_id)}
                >
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<GoTrash size={14} />}
                  />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        </div>
      ),
      width: 80,
      fixed: "right",
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getQuotationList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.vessel_id,
    params.event_id,
    debouncedSearch,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap">
        <PageHeading>QUOTATION</PageHeading>
        <Breadcrumb
          items={[{ title: "Quotation" }, { title: "List" }]}
          separator=">"
        />
      </div>

      <div className="mt-4 bg-white p-2 rounded-md">
        <div className="flex justify-between items-center gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) =>
              dispatch(setQuotationListParams({ search: e.target.value }))
            }
          />

          <div className="flex gap-2 items-center">
            {permissions.delete ? (
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}
              >
                Delete
              </Button>
            ) : null}
            {permissions.add ? (
              <Link to="/quotation/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: "checkbox",
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) =>
                    dispatch(setQuotationDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="quotation_id"
          scroll={{ x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} quotations`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setQuotationListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              })
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these quotations?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default Quotation;
