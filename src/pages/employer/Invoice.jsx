import React, { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import "./empSubSections.css";


function normaliseStatus(raw) {
  return raw?.toLowerCase() === "paid" ? "paid" : "unpaid";
}

function StatusBadge({ raw }) {
  const status = normaliseStatus(raw);
  return (
    <span className={`mi-badge mi-badge--${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}


function Search({ onSearch }) {
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ LIVE SEARCH
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") inputRef.current?.blur();
  };

  return (
    <div className="srch-container">
      <div className="srch-box">
        <span className="srch-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search Something..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="srch-input"
        />

        {/* button kept for UI (no logic change) */}
        <button className="srch-button">
          Search
        </button>
      </div>
    </div>
  );
}


export function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // ✅ NEW

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/payment/v1/credit_purchase_history/");

      const data = res.data?.data?.results || [];

      const formatted = data.map((item, index) => ({
        id: item.id || index,
        invoiceNumber: `#INV${item.id}`,
        invoiceDate: item.paid_at
          ? item.paid_at.split("T")[0]
          : item.created_at
          ? item.created_at.split("T")[0]
          : "—",
        total: item.amount_paid || item.amount || 0,
        status: item.is_paid ? "paid" : "unpaid",
      }));

      setInvoices(formatted);
      setFilteredInvoices(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (query) => {
    let filtered = [...invoices];

    if (query) {
      const q = query.toLowerCase();

      filtered = filtered.filter((inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||          // invoice
        inv.invoiceDate.includes(q) ||                          // date
        inv.total.toString().includes(q)                        // amount
      );
    }

    // ✅ STATUS FILTER
    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  };

  // re-run when filter changes
  useEffect(() => {
    handleSearch("");
  }, [statusFilter]);

  return (
    <div className="mi-root">
      {/* HEADER */}
      <div className="mi-header">
        <div className="mi-header__info">
          <h2 className="mi-header__title">My Invoices</h2>
          <p className="mi-header__subtitle">
            Your invoices history with us.
          </p>
        </div>

        <div className="mi-header__search">
          <Search onSearch={handleSearch} />
        </div>
      </div>

      {/* 🔥 FILTER (NO UI BREAK — SIMPLE ADD) */}
      <div style={{ marginBottom: "10px" }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "6px" }}
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="mi-table-wrap">
        <table className="mi-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Invoice Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="4">No invoices found</td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="mi-table__mono">{inv.invoiceNumber}</td>
                  <td>{inv.invoiceDate}</td>
                  <td className="mi-table__mono">
                    ₹{inv.total.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <StatusBadge raw={inv.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="mi-card-list">
        {filteredInvoices.map((inv) => (
          <div key={inv.id} className="mi-card">
            <div className="mi-card__top">
              <span className="mi-card__number">{inv.invoiceNumber}</span>
              <StatusBadge raw={inv.status} />
            </div>

            <div className="mi-card__bottom">
              <span className="mi-card__date">{inv.invoiceDate}</span>
              <span className="mi-card__total">
                ₹{inv.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}