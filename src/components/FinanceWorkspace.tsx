import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import {
  DollarSign,
  TrendingUp,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

interface FinanceWorkspaceProps {
  db: InMemoryDatabase;
  currentUserId: string;
}

export const FinanceWorkspace: React.FC<FinanceWorkspaceProps> = ({ db, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'payouts' | 'ledger'>('overview');
  const [version, setVersion] = useState(0);

  // Record Manual Payment Modal State
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('org-school-1');
  const [payAmountRupees, setPayAmountRupees] = useState('50000');
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'neft_rtgs' | 'cheque' | 'manual_cash'>('bank_transfer');
  const [payReference, setPayReference] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [payNotes, setPayNotes] = useState('');

  // Allocate Payment Modal State
  const [allocPaymentId, setAllocPaymentId] = useState<string | null>(null);
  const [allocInvoiceId, setAllocInvoiceId] = useState('');
  const [allocAmountRupees, setAllocAmountRupees] = useState('');

  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const metrics = useMemo(() => db.getRevenueMetricsSummary(true), [db, version]);
  const allInvoices = useMemo(() => Array.from(db.trainingInvoices.values()), [db, version]);
  const allPayments = useMemo(() => db.getRecordedPayments(undefined, true), [db, version]);
  const allPayouts = useMemo(() => db.getAllPayouts(), [db, version]);
  const ledgerEntries = useMemo(() => db.getFinancialLedger(true), [db, version]);
  const allOrgs = Array.from(db.organizations.values());

  const formatRupees = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payReference.trim() || !payAmountRupees) return;
    try {
      const amountPaise = (parseInt(payAmountRupees, 10) || 0) * 100;
      db.recordPaymentReceipt(currentUserId, {
        organizationId: selectedOrgId,
        amountPaise,
        paymentMethod: payMethod,
        transactionReference: payReference.trim(),
        bankName: bankName.trim(),
        notes: payNotes.trim(),
      });
      setIsRecordPaymentOpen(false);
      setPayReference('');
      setPayNotes('');
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Payment receipt recorded into verified ledger!', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleAllocatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocPaymentId || !allocInvoiceId || !allocAmountRupees) return;
    try {
      const amountPaise = (parseInt(allocAmountRupees, 10) || 0) * 100;
      db.allocatePaymentToInvoice(currentUserId, allocPaymentId, allocInvoiceId, amountPaise);
      setAllocPaymentId(null);
      setAllocAmountRupees('');
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Payment allocated to invoice. Ledger entries updated.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleReconcilePayment = (paymentId: string) => {
    try {
      db.reconcilePayment(currentUserId, paymentId);
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Payment reconciled against verified bank statement.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  const handleSettlePayout = (payoutId: string) => {
    try {
      db.settleTrainerPayout(currentUserId, payoutId);
      setVersion((v) => v + 1);
      setActionMsg({ text: 'Trainer payout verified and marked settled.', type: 'success' });
    } catch (err: any) {
      setActionMsg({ text: err.message, type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card-elevated" style={{ padding: '24px 28px', borderLeft: '5px solid #10B981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-success">FINANCE OPERATIONS</span>
              <span className="badge badge-neutral">Double-Entry Financial Ledger</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Geniusphere Revenue & Commercial Treasury</h1>
            <p style={{ color: 'var(--text-secondary, #6B7280)', margin: '4px 0 0 0', fontSize: '14px' }}>
              Audited invoices, recorded bank receipts, manual payment allocations, and trainer payables.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsRecordPaymentOpen(true)}
            >
              <CreditCard size={18} /> Record Bank Payment
            </button>
          </div>
        </div>

        {actionMsg && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: actionMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: actionMsg.type === 'success' ? '#065F46' : '#991B1B',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {actionMsg.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', borderBottom: '1px solid var(--border-color, #E5E7EB)', paddingBottom: '12px' }}>
          {[
            { id: 'overview', label: 'Financial Overview', icon: TrendingUp },
            { id: 'invoices', label: `Invoices (${allInvoices.length})`, icon: FileText },
            { id: 'payments', label: `Recorded Receipts (${allPayments.length})`, icon: CreditCard },
            { id: 'payouts', label: `Trainer Payables (${allPayouts.length})`, icon: DollarSign },
            { id: 'ledger', label: `General Ledger (${ledgerEntries.length})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn ${active ? 'btn-primary' : 'btn-ghost'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Financial KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="card-elevated" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>GROSS BOOKINGS VALUE</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary, #111827)', marginTop: '8px' }}>
                {formatRupees(metrics.grossBookingValuePaise)}
              </div>
              <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>
                {metrics.activeBookingsCount} active engagements
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>PLATFORM REVENUE (EARNED)</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563EB', marginTop: '8px' }}>
                {formatRupees(metrics.earnedPlatformRevenuePaise)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B7280)', marginTop: '4px' }}>
                Platform margin & service fees
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>OUTSTANDING RECEIVABLES</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', marginTop: '8px' }}>
                {formatRupees(metrics.outstandingReceivablesPaise)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B7280)', marginTop: '4px' }}>
                Unpaid issued school invoices
              </div>
            </div>

            <div className="card-elevated" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>TRAINER PAYABLES ACCRUED</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#7C3AED', marginTop: '8px' }}>
                {formatRupees(metrics.trainerPayablesPaise)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #6B7280)', marginTop: '4px' }}>
                {formatRupees(metrics.actualPayoutsCompletedPaise)} settled to date
              </div>
            </div>
          </div>

          {/* Operational Runbook & Compliance Note */}
          <div className="card-elevated" style={{ padding: '20px 24px', backgroundColor: 'var(--bg-card-secondary, #F9FAFB)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#10B981" /> Treasury Runbook & Manual Gateway Isolation
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #4B5563)', margin: 0, lineHeight: 1.6 }}>
              In accordance with strict production financial governance: <strong>all payments are recorded from verified bank instruments (NEFT/RTGS/Cheque)</strong> with unique transaction references. Automated payment gateway credentials remain intentionally unconfigured until commercial merchant underwriting is completed.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="card-elevated" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Issued Institutional Invoices</h2>
          {allInvoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #6B7280)' }}>
              No commercial invoices issued yet. Invoices are generated automatically when a school accepts an authorized training quote.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #E5E7EB)', color: 'var(--text-secondary, #6B7280)' }}>
                    <th style={{ padding: '12px' }}>Invoice #</th>
                    <th style={{ padding: '12px' }}>Subtotal</th>
                    <th style={{ padding: '12px' }}>GST (18%)</th>
                    <th style={{ padding: '12px' }}>Total Amount</th>
                    <th style={{ padding: '12px' }}>Issued Date</th>
                    <th style={{ padding: '12px' }}>Due Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color, #E5E7EB)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{inv.invoice_number}</td>
                      <td style={{ padding: '12px' }}>{formatRupees(inv.subtotal_paise)}</td>
                      <td style={{ padding: '12px' }}>{formatRupees(inv.tax_paise)}</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{formatRupees(inv.total_paise)}</td>
                      <td style={{ padding: '12px' }}>{new Date(inv.issued_at).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>{new Date(inv.due_at).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECORDED PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="card-elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Recorded Bank Payments & Receipts</h2>
            <button className="btn btn-primary" onClick={() => setIsRecordPaymentOpen(true)}>+ Record New Payment</button>
          </div>

          {allPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #6B7280)' }}>
              No payments recorded yet. Click "+ Record New Payment" to record verified bank transfers or cheques.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #E5E7EB)', color: 'var(--text-secondary, #6B7280)' }}>
                    <th style={{ padding: '12px' }}>Tx Reference</th>
                    <th style={{ padding: '12px' }}>Organization</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Method</th>
                    <th style={{ padding: '12px' }}>Bank</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color, #E5E7EB)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}><code>{p.transaction_reference}</code></td>
                      <td style={{ padding: '12px' }}>{p.organization_name || p.organization_id}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#10B981' }}>{formatRupees(p.amount_paise)}</td>
                      <td style={{ padding: '12px' }}>{p.payment_method.toUpperCase()}</td>
                      <td style={{ padding: '12px' }}>{p.bank_name || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{p.payment_date}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${p.status === 'reconciled' ? 'badge-success' : 'badge-neutral'}`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {p.status === 'recorded' && (
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleReconcilePayment(p.id)}
                            >
                              Reconcile
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              setAllocPaymentId(p.id);
                              setAllocAmountRupees(String(p.amount_paise / 100));
                            }}
                          >
                            Allocate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TRAINER PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="card-elevated" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Trainer Compensation Payables</h2>
          {allPayouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #6B7280)' }}>
              No trainer compensation records found. Payouts accrue automatically when verified trainers are confirmed on assignments.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #E5E7EB)', color: 'var(--text-secondary, #6B7280)' }}>
                    <th style={{ padding: '12px' }}>Trainer</th>
                    <th style={{ padding: '12px' }}>Assignment ID</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Idempotency Key</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayouts.map((po) => (
                    <tr key={po.id} style={{ borderBottom: '1px solid var(--border-color, #E5E7EB)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>Vikram Singh</td>
                      <td style={{ padding: '12px' }}><code>{po.assignment_id}</code></td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{formatRupees(po.amount_paise)}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${po.status === 'settled' ? 'badge-success' : 'badge-warning'}`}>
                          {po.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}><code>{po.idempotency_key}</code></td>
                      <td style={{ padding: '12px' }}>
                        {po.status !== 'settled' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSettlePayout(po.id)}
                          >
                            Mark Settled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="card-elevated" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Double-Entry Audited Financial Ledger</h2>
          {ledgerEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #6B7280)' }}>
              General ledger is empty. Bookings and payment records post entries automatically here.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #E5E7EB)', color: 'var(--text-secondary, #6B7280)' }}>
                    <th style={{ padding: '12px' }}>Entry #</th>
                    <th style={{ padding: '12px' }}>Account</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Description</th>
                    <th style={{ padding: '12px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((le) => (
                    <tr key={le.id} style={{ borderBottom: '1px solid var(--border-color, #E5E7EB)' }}>
                      <td style={{ padding: '12px' }}>#{le.entry_number}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}><code>{le.account_type}</code></td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${le.entry_type === 'debit' ? 'badge-primary' : 'badge-neutral'}`}>
                          {le.entry_type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{formatRupees(le.amount_paise)}</td>
                      <td style={{ padding: '12px' }}>{le.description}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary, #6B7280)' }}>
                        {new Date(le.created_at).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: RECORD MANUAL PAYMENT */}
      {isRecordPaymentOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Record Verified Bank Payment</h3>
            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Organization</label>
                <select
                  className="input-field"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                >
                  {allOrgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Received Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={payAmountRupees}
                  onChange={(e) => setPayAmountRupees(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Payment Method</label>
                  <select
                    className="input-field"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                  >
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="neft_rtgs">NEFT / RTGS</option>
                    <option value="cheque">Cheque</option>
                    <option value="manual_cash">Manual Cash Receipt</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Bank Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Bank Transaction Reference / UTR #</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. UTR-SBI-20261026-9874"
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Notes & Verification Evidence</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Reference bank statement batch or branch stamp details"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsRecordPaymentOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE PAYMENT */}
      {allocPaymentId && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Allocate Payment to Invoice</h3>
            <form onSubmit={handleAllocatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Select Target Invoice</label>
                <select
                  className="input-field"
                  value={allocInvoiceId}
                  onChange={(e) => setAllocInvoiceId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Invoice --</option>
                  {allInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_number} ({formatRupees(inv.total_paise)} - {inv.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Allocation Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={allocAmountRupees}
                  onChange={(e) => setAllocAmountRupees(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setAllocPaymentId(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
