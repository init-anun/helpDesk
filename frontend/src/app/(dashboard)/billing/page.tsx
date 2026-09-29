"use client";

import { useMemo, useState } from "react";
import { Plus, Receipt } from "lucide-react";

import {
  DataTable,
  DataTableSearch,
  DataTablePagination,
} from "@/components/data-table";

import type { DataTableColumn } from "@/components/data-table";

interface BillingRecord {
  id: number;
  invoiceId: string;
  patientName: string;
  patientId: string;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Online";
  date: string;
  status: "Paid" | "Pending" | "Cancelled";
}

const billingRecords: BillingRecord[] = [
  {
    id: 1,
    invoiceId: "INV-1001",
    patientName: "John Doe",
    patientId: "PT-1001",
    amount: 2500,
    paymentMethod: "Cash",
    date: "2026-09-01",
    status: "Paid",
  },
  {
    id: 2,
    invoiceId: "INV-1002",
    patientName: "Sarah Wilson",
    patientId: "PT-1002",
    amount: 3500,
    paymentMethod: "Card",
    date: "2026-09-03",
    status: "Paid",
  },
  {
    id: 3,
    invoiceId: "INV-1003",
    patientName: "Michael Brown",
    patientId: "PT-1003",
    amount: 1800,
    paymentMethod: "Cash",
    date: "2026-09-05",
    status: "Pending",
  },
  {
    id: 4,
    invoiceId: "INV-1004",
    patientName: "Emily Johnson",
    patientId: "PT-1004",
    amount: 4200,
    paymentMethod: "Bank Transfer",
    date: "2026-09-07",
    status: "Paid",
  },
  {
    id: 5,
    invoiceId: "INV-1005",
    patientName: "David Smith",
    patientId: "PT-1005",
    amount: 3000,
    paymentMethod: "Online",
    date: "2026-09-10",
    status: "Paid",
  },
  {
    id: 6,
    invoiceId: "INV-1006",
    patientName: "Sophia Miller",
    patientId: "PT-1006",
    amount: 2750,
    paymentMethod: "Card",
    date: "2026-09-12",
    status: "Pending",
  },
  {
    id: 7,
    invoiceId: "INV-1007",
    patientName: "Robert Taylor",
    patientId: "PT-1007",
    amount: 1500,
    paymentMethod: "Cash",
    date: "2026-09-15",
    status: "Cancelled",
  },
  {
    id: 8,
    invoiceId: "INV-1008",
    patientName: "Olivia Anderson",
    patientId: "PT-1008",
    amount: 5000,
    paymentMethod: "Online",
    date: "2026-09-18",
    status: "Paid",
  },
  {
    id: 9,
    invoiceId: "INV-1009",
    patientName: "James Thomas",
    patientId: "PT-1009",
    amount: 2200,
    paymentMethod: "Card",
    date: "2026-09-20",
    status: "Paid",
  },
  {
    id: 10,
    invoiceId: "INV-1010",
    patientName: "Emma Martinez",
    patientId: "PT-1010",
    amount: 3200,
    paymentMethod: "Bank Transfer",
    date: "2026-09-22",
    status: "Pending",
  },
];

const PAGE_SIZE = 5;

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBilling = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return billingRecords;
    }

    return billingRecords.filter((record) =>
      [
        record.invoiceId,
        record.patientName,
        record.patientId,
        record.amount,
        record.paymentMethod,
        record.date,
        record.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  const totalPages = Math.ceil(
    filteredBilling.length / PAGE_SIZE
  );

  const paginatedBilling = filteredBilling.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleView = (record: BillingRecord) => {
    console.log("View:", record);
  };

  const handleEdit = (record: BillingRecord) => {
    console.log("Edit:", record);
  };

  const handleDelete = (record: BillingRecord) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete invoice ${record.invoiceId}?`
    );

    if (!confirmed) return;

    console.log("Delete:", record);
  };

  const handleAddBilling = () => {
    console.log("Create invoice");
  };

  const columns: DataTableColumn<BillingRecord>[] = [
    {
      key: "invoiceId",
      header: "Invoice ID",
      render: (record) => (
        <span className="font-medium text-slate-700">
          {record.invoiceId}
        </span>
      ),
    },
    {
      key: "patientName",
      header: "Patient",
      render: (record) => (
        <div>
          <p className="font-medium text-slate-800">
            {record.patientName}
          </p>

          <p className="text-xs text-slate-400">
            {record.patientId}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (record) => (
        <span className="font-medium text-slate-700">
          NPR {record.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "status",
      header: "Status",
      render: (record) => {
        const statusClass =
          record.status === "Paid"
            ? "bg-emerald-50 text-emerald-600"
            : record.status === "Pending"
            ? "bg-amber-50 text-amber-600"
            : "bg-red-50 text-red-600";

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
          >
            {record.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Billing
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage invoices, payments, and billing records
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBilling}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All Billing Records
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredBilling.length}{" "}
                {filteredBilling.length === 1
                  ? "record"
                  : "records"}{" "}
                found
              </p>
            </div>

            <DataTableSearch
              value={search}
              onChange={handleSearch}
              placeholder="Search invoices..."
            />
          </div>

          <DataTable
            data={paginatedBilling}
            columns={columns}
            getRowKey={(record) => record.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No billing records found."
          />

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBilling.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}