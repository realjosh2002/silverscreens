'use client'

export const dynamic = 'force-dynamic'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopnav  from '@/components/layout/AdminTopnav'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, Download, Search, RefreshCw,
  FileSpreadsheet, Filter, AlertCircle, CheckCircle2,
} from 'lucide-react'
import ExcelJS from 'exceljs'

/* ─── Tokens ── */
const BG    = '#050505'
const BG2   = '#0B0F14'
const BG3   = '#121821'
const BG4   = 'rgba(255,255,255,0.03)'
const GOLD  = '#D4A64A'
const RED   = '#C8202A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const PURPLE= '#8B5CF6'
const ORANGE= '#F97316'
const BEBAS = "'Bebas Neue', sans-serif"
const BARLOW= "'Barlow Condensed', sans-serif"

function getToken() {
  try { return JSON.parse(localStorage.getItem('ss_user')||sessionStorage.getItem('ss_user')||'{}').token||'' }
  catch { return '' }
}

interface Row {
  sno:number; profile_number:string; user_type:string; full_name:string
  email:string; phone:string; date_of_birth:string; gender:string
  company_name:string; contact_person:string
  city:string; state:string; country:string; pincode:string
  plan_name:string; subscription_status:string; starts_at:string; ends_at:string; subscribed_on:string
  currency:string; base_amount:number; discount_amount:number; taxable_amount:number
  gst_rate_pct:number; gst_type:string
  cgst_amount:number; sgst_amount:number; igst_amount:number; total_gst:number; total_amount:number
  payment_method:string; transaction_id:string; razorpay_order_id:string
  razorpay_payment_id:string; gateway_status:string; coupon_code:string
  gst_number:string; pan_number:string; registration_number:string
  category:string; role_category:string; experience_level:string
  verification_status:string; trust_score:any; profile_completion:any
  account_active:string; email_verified:string; member_since:string
}

interface Summary {
  total:number; aspirantCount:number; agencyCount:number
  totalRevenue:number; aspirantRevenue:number; agencyRevenue:number
  totalGST:number; totalCGST:number; totalSGST:number; totalIGST:number
  totalBase:number; totalDiscount:number
  intraStateCount:number; interStateCount:number; exportCount:number
  from:string; to:string
}

/* ─── Colour constants for XLSX ── */
const XL = {
  black:    '00000000',
  darkBg:   'FF0B0F14',
  headerBg: 'FF0B0F14',
  gold:     'FFD4A64A',
  green:    'FF22C55E',
  red:      'FFC8202A',
  orange:   'FFF97316',
  purple:   'FF8B5CF6',
  blue:     'FF3B82F6',
  white:    'FFF5F5F5',
  gstRow:   'FF1A1200',   // dark amber tint for GST row
  totalRow: 'FF0A1A0A',   // dark green tint for totals row
  aspBg:    'FF1A0F2E',   // dark purple tint for aspirant rows
  agcBg:    'FF0F1A2E',   // dark blue tint for agency rows
  subHdr:   'FF1C1208',   // summary header row bg
}

type CellStyle = Partial<{
  bold: boolean; italic: boolean; size: number; color: string; bg: string
  align: 'left'|'center'|'right'; wrap: boolean; border: boolean
}>

function applyStyle(cell: ExcelJS.Cell, s: CellStyle) {
  if (s.bold !== undefined || s.italic !== undefined || s.size || s.color) {
    cell.font = {
      bold:   s.bold   ?? false,
      italic: s.italic ?? false,
      size:   s.size   ?? 11,
      color:  s.color  ? { argb: s.color } : { argb: XL.white },
    }
  }
  if (s.bg) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: s.bg } }
  if (s.align) cell.alignment = { horizontal: s.align, vertical: 'middle', wrapText: s.wrap ?? false }
  if (s.border) {
    const b = { style: 'thin' as const, color: { argb: 'FF2A3444' } }
    cell.border = { top: b, bottom: b, left: b, right: b }
  }
}

async function buildXLSX(rows: Row[], summary: Summary): Promise<Blob> {
  const wb = new ExcelJS.Workbook()
  wb.creator    = 'SilverScreens Admin'
  wb.lastModifiedBy = 'SilverScreens'
  wb.created    = new Date()

  const aspRows2 = rows.filter(r => r.user_type === 'Aspirant')
  const agcRows2 = rows.filter(r => r.user_type === 'Agency')
  const sumX = (arr: Row[], f: (r: Row) => number) => arr.reduce((s, r) => s + f(r), 0)

  /* ════════════════════════════════════════════════
     SHEET 1 — SUMMARY
  ════════════════════════════════════════════════ */
  const ws1 = wb.addWorksheet('Summary')
  ws1.columns = [
    { width: 34 }, { width: 4 }, { width: 20 }, { width: 20 }, { width: 20 }
  ]

  // Title
  ws1.mergeCells('A1:E1')
  const title = ws1.getCell('A1')
  title.value = 'SILVERSCREENS — SUBSCRIPTION REVENUE REPORT'
  applyStyle(title, { bold: true, size: 14, color: XL.gold, bg: XL.darkBg, align: 'center' })
  ws1.getRow(1).height = 28

  ws1.mergeCells('A2:E2')
  const gen = ws1.getCell('A2')
  gen.value = `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
  applyStyle(gen, { size: 10, color: 'FF888888', bg: XL.darkBg, align: 'center' })

  ws1.mergeCells('A3:E3')
  const per = ws1.getCell('A3')
  per.value = `Period: ${summary.from}  →  ${summary.to}`
  applyStyle(per, { size: 11, color: 'FFAAAAAA', bg: XL.darkBg, align: 'center' })

  ws1.addRow([]) // spacer

  // Header row
  const hdrRow = ws1.addRow(['SUMMARY', '', 'Aspirants', 'Agencies', 'Total'])
  hdrRow.height = 22
  ;['A5','C5','D5','E5'].forEach(addr => {
    applyStyle(ws1.getCell(addr), { bold: true, size: 12, color: XL.white, bg: XL.headerBg, align: 'center', border: true })
  })

  // Data rows
  const summaryRows: [string, string, number|string, number|string, number|string][] = [
    ['Subscription Count',        '',  aspRows2.length,                           agcRows2.length,                           rows.length],
    ['Base Amount (₹)',           '',  sumX(aspRows2, r=>r.base_amount),           sumX(agcRows2, r=>r.base_amount),           summary.totalBase + summary.totalDiscount],
    ['Discount (₹)',              '',  sumX(aspRows2, r=>r.discount_amount),       sumX(agcRows2, r=>r.discount_amount),       summary.totalDiscount],
    ['Taxable Amount (₹)',        '',  sumX(aspRows2, r=>r.taxable_amount),        sumX(agcRows2, r=>r.taxable_amount),        summary.totalBase],
    ['─── Intra-State (TN) ───',  '',  '', '', ''],
    ['CGST @ 9% (₹)',             '',  sumX(aspRows2, r=>r.cgst_amount),           sumX(agcRows2, r=>r.cgst_amount),           summary.totalCGST],
    ['SGST @ 9% (₹)',             '',  sumX(aspRows2, r=>r.sgst_amount),           sumX(agcRows2, r=>r.sgst_amount),           summary.totalSGST],
    ['─── Inter-State ───',       '',  '', '', ''],
    ['IGST @ 18% (₹)',            '',  sumX(aspRows2, r=>r.igst_amount),           sumX(agcRows2, r=>r.igst_amount),           summary.totalIGST],
    ['─── Total GST ───',         '',  '', '', ''],
    ['Total GST Payable (₹)',     '',  sumX(aspRows2, r=>r.total_gst),             sumX(agcRows2, r=>r.total_gst),             summary.totalGST],
    ['Total Revenue (₹)',         '',  sumX(aspRows2, r=>r.total_amount),          sumX(agcRows2, r=>r.total_amount),          summary.totalRevenue],
    ['─── Transaction Types ───', '',  '', '', ''],
    ['Intra-State Transactions',  '',  rows.filter(r=>r.user_type==='Aspirant'&&r.gst_type==='Intra-State').length, rows.filter(r=>r.user_type==='Agency'&&r.gst_type==='Intra-State').length, summary.intraStateCount],
    ['Inter-State Transactions',  '',  rows.filter(r=>r.user_type==='Aspirant'&&r.gst_type==='Inter-State').length, rows.filter(r=>r.user_type==='Agency'&&r.gst_type==='Inter-State').length, summary.interStateCount],
    ['Export (Outside India)',    '',  rows.filter(r=>r.user_type==='Aspirant'&&r.gst_type==='Export (0%)').length, rows.filter(r=>r.user_type==='Agency'&&r.gst_type==='Export (0%)').length, summary.exportCount],
  ]

  summaryRows.forEach(([label, , asp, agc, total], idx) => {
    const isSectionHdr = label.startsWith('───')
    const isGST   = label.includes('GST') && !isSectionHdr
    const isTotal = label === 'Total Revenue (₹)'
    const isTax   = label === 'Taxable Amount (₹)'
    const isIGST  = label.includes('IGST')
    const bg = isTotal ? XL.totalRow : isGST || isIGST ? XL.gstRow : isSectionHdr ? 'FF0A0A0A' : 'FF0D1117'
    const labelColor = isTotal ? XL.green : isGST || isIGST ? XL.orange : isSectionHdr ? 'FF444444' : XL.white
    const numColor   = isTotal ? XL.green : isGST || isIGST ? XL.orange : isTax ? 'FFDDDDDD' : XL.white

    const row = ws1.addRow([label, '', asp, agc, total])
    row.height = isSectionHdr ? 16 : 20

    applyStyle(row.getCell(1), { bold: isTotal||isGST||isIGST, italic: isSectionHdr, size: isSectionHdr?9:11, color: labelColor, bg, border: !isSectionHdr })
    if (!isSectionHdr) {
      ;[3, 4, 5].forEach(c => {
        const cell = row.getCell(c)
        const isCount = label.includes('Count') || label.includes('Transaction')
        cell.value = typeof cell.value === 'number' ? parseFloat((cell.value as number).toFixed(2)) : cell.value
        cell.numFmt = isCount ? '0' : '#,##0.00'
        applyStyle(cell, { bold: isTotal, size: 11, color: numColor, bg, align: 'center', border: true })
      })
    } else {
      ws1.mergeCells(`A${row.number}:E${row.number}`)
      applyStyle(row.getCell(1), { italic: true, size: 9, color: '55555555', bg: 'FF0A0A0A', align: 'center' })
    }
  })

  // Notes
  ws1.addRow([])
  const note1 = ws1.addRow(['Note: GST = CGST 9% + SGST 9% = 18% total. Use IGST for inter-state transactions.'])
  ws1.mergeCells(`A${note1.number}:E${note1.number}`)
  applyStyle(note1.getCell(1), { italic: true, size: 10, color: 'FF666666' })
  const note2 = ws1.addRow(['Note: Empty / uncollected fields are marked NA.'])
  ws1.mergeCells(`A${note2.number}:E${note2.number}`)
  applyStyle(note2.getCell(1), { italic: true, size: 10, color: 'FF666666' })

  /* ════════════════════════════════════════════════
     SHARED HELPERS FOR DATA SHEETS
  ════════════════════════════════════════════════ */
  function addDataSheet(name: string, headers: string[], dataRows: any[][], colWidths: number[]) {
    const ws = wb.addWorksheet(name)
    ws.columns = colWidths.map(w => ({ width: w }))

    // Header row
    const hdr = ws.addRow(headers)
    hdr.height = 22
    hdr.eachCell(cell => {
      applyStyle(cell, { bold: true, size: 10, color: XL.gold, bg: XL.headerBg, align: 'center', border: true })
    })
    ws.views = [{ state: 'frozen', ySplit: 1 }]

    // Data rows
    dataRows.forEach(rowData => {
      const row = ws.addRow(rowData)
      row.height = 18
      const userType = rowData[2] // column C = Subscriber Type
      const isAsp = userType === 'Aspirant'
      const isAgc = userType === 'Agency'
      const rowBg  = isAsp ? XL.aspBg : isAgc ? XL.agcBg : 'FF0D1117'

      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        const isAmt = headers[colNum - 1]?.includes('(₹)') || headers[colNum - 1]?.includes('Amount')
        const isGST = headers[colNum - 1]?.includes('GST') || headers[colNum - 1]?.includes('CGST') || headers[colNum - 1]?.includes('SGST')
        const isTotal = headers[colNum - 1]?.includes('Total Amount') || headers[colNum - 1]?.includes('Total Invoice')
        const color = isTotal ? XL.green : isGST ? XL.orange : XL.white
        if (isAmt && typeof cell.value === 'number') cell.numFmt = '#,##0.00'
        applyStyle(cell, { size: 10, color, bg: rowBg, align: isAmt ? 'right' : 'left', border: true })
      })
    })

    // Totals row (find all ₹ columns and sum them)
    const amtColIdxs = headers.map((h,i) => h.includes('(₹)') || h.includes('Amount') ? i : -1).filter(i=>i>=0)
    if (amtColIdxs.length && dataRows.length) {
      const totalsRow = ws.addRow(headers.map((h, i) => {
        if (i === 0) return 'TOTALS'
        if (i === 3) return `${dataRows.length} records`
        if (amtColIdxs.includes(i)) return parseFloat(dataRows.reduce((s, r) => s + (typeof r[i]==='number'?r[i]:0), 0).toFixed(2))
        return ''
      }))
      totalsRow.height = 22
      totalsRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
        const isAmt = amtColIdxs.includes(colNum - 1)
        if (isAmt && typeof cell.value === 'number') cell.numFmt = '#,##0.00'
        applyStyle(cell, { bold: true, size: 11, color: XL.gold, bg: XL.totalRow, align: isAmt ? 'right' : 'left', border: true })
      })
    }
    return ws
  }

  /* ════════════════════════════════════════════════
     SHEET 2 — ALL SUBSCRIPTIONS
  ════════════════════════════════════════════════ */
  const ALL_HDRS = [
    'S.No','Profile No.','Subscriber Type','Full Name / Company',
    'Email','Phone','Date of Birth','Gender',
    'City','State','Country','Pincode',
    'Plan Name','Subscription Status','Subscription Date','Start Date','End Date',
    'Currency','Base Amount (₹)','Discount (₹)','Taxable Amount (₹)',
    'GST Rate (%)','GST Type','CGST (₹)','SGST (₹)','IGST (₹)','Total GST (₹)','Total Amount (₹)',
    'Payment Method','Transaction ID','Razorpay Order ID','Razorpay Payment ID',
    'Gateway Status','Coupon Code',
    'GST Number','PAN Number','Registration No.',
    'Category / Company Type','Role / Specialization','Experience Level',
    'Verification Status','Trust Score','Profile Completion (%)',
    'Account Active','Email Verified','Member Since',
  ]
  const allData = rows.map(r => [
    r.sno, na(r.profile_number), r.user_type, na(r.full_name),
    na(r.email), na(r.phone), na(r.date_of_birth), na(r.gender),
    na(r.city), na(r.state), na(r.country), na(r.pincode),
    na(r.plan_name), na(r.subscription_status), na(r.subscribed_on), na(r.starts_at), na(r.ends_at),
    na(r.currency),
    parseFloat(r.base_amount.toFixed(2)), parseFloat(r.discount_amount.toFixed(2)), parseFloat(r.taxable_amount.toFixed(2)),
    r.gst_rate_pct, r.gst_type,
    parseFloat(r.cgst_amount.toFixed(2)), parseFloat(r.sgst_amount.toFixed(2)),
    parseFloat(r.igst_amount.toFixed(2)), parseFloat(r.total_gst.toFixed(2)), parseFloat(r.total_amount.toFixed(2)),
    na(r.payment_method), na(r.transaction_id), na(r.razorpay_order_id), na(r.razorpay_payment_id),
    na(r.gateway_status), na(r.coupon_code),
    na(r.gst_number), na(r.pan_number), na(r.registration_number),
    na(r.category), na(r.role_category), na(r.experience_level),
    na(r.verification_status), r.trust_score !== '' ? r.trust_score : 'NA',
    r.profile_completion !== '' ? r.profile_completion : 'NA',
    na(r.account_active), na(r.email_verified), na(r.member_since),
  ])
  const allWidths = [5,14,16,28,32,16,14,10,16,16,14,10,16,16,20,12,12,8,14,12,14,10,14,12,12,12,12,14,16,20,22,22,14,14,20,16,20,22,20,18,18,12,16,14,14,14,14]
  addDataSheet('All Subscriptions', ALL_HDRS, allData, allWidths)

  /* ════════════════════════════════════════════════
     SHEET 3 — ASPIRANTS
  ════════════════════════════════════════════════ */
  const ASP_HDRS = [
    'S.No','Profile No.','Subscriber Type','Full Name','Email','Phone','Date of Birth','Gender',
    'City','State','Country','Pincode',
    'Plan Name','Status','Subscription Date','Start Date','End Date',
    'Base Amount (₹)','Discount (₹)','Taxable Amount (₹)',
    'GST Type','CGST (₹)','SGST (₹)','IGST (₹)','Total GST (₹)','Total Amount (₹)',
    'Payment Method','Razorpay Payment ID','Coupon Code',
    'Category','Role','Experience Level','Verification','Trust Score','Profile Completion (%)','Member Since',
  ]
  const aspData2 = aspRows2.map((r,i) => [
    i+1, na(r.profile_number), r.user_type, na(r.full_name), na(r.email), na(r.phone),
    na(r.date_of_birth), na(r.gender), na(r.city), na(r.state), na(r.country), na(r.pincode),
    na(r.plan_name), na(r.subscription_status), na(r.subscribed_on), na(r.starts_at), na(r.ends_at),
    parseFloat(r.base_amount.toFixed(2)), parseFloat(r.discount_amount.toFixed(2)), parseFloat(r.taxable_amount.toFixed(2)),
    r.gst_type,
    parseFloat(r.cgst_amount.toFixed(2)), parseFloat(r.sgst_amount.toFixed(2)),
    parseFloat(r.igst_amount.toFixed(2)), parseFloat(r.total_gst.toFixed(2)), parseFloat(r.total_amount.toFixed(2)),
    na(r.payment_method), na(r.razorpay_payment_id), na(r.coupon_code),
    na(r.category), na(r.role_category), na(r.experience_level),
    na(r.verification_status), r.trust_score !== '' ? r.trust_score : 'NA',
    r.profile_completion !== '' ? r.profile_completion : 'NA', na(r.member_since),
  ])
  addDataSheet('Aspirants', ASP_HDRS, aspData2, ASP_HDRS.map(() => 16))

  /* ════════════════════════════════════════════════
     SHEET 4 — AGENCIES
  ════════════════════════════════════════════════ */
  const AGC_HDRS = [
    'S.No','Profile No.','Subscriber Type','Company Name','Contact Person','Email','Phone',
    'City','State','Country','Pincode',
    'GST Number','PAN Number','Registration No.',
    'Plan Name','Status','Subscription Date','Start Date','End Date',
    'Base Amount (₹)','Discount (₹)','Taxable Amount (₹)',
    'GST Type','CGST (₹)','SGST (₹)','IGST (₹)','Total GST (₹)','Total Amount (₹)',
    'Payment Method','Razorpay Payment ID','Coupon Code',
    'Company Type','Verification','Trust Score','Member Since',
  ]
  const agcData2 = agcRows2.map((r,i) => [
    i+1, na(r.profile_number), r.user_type, na(r.full_name), na(r.contact_person),
    na(r.email), na(r.phone), na(r.city), na(r.state), na(r.country), na(r.pincode),
    na(r.gst_number), na(r.pan_number), na(r.registration_number),
    na(r.plan_name), na(r.subscription_status), na(r.subscribed_on), na(r.starts_at), na(r.ends_at),
    parseFloat(r.base_amount.toFixed(2)), parseFloat(r.discount_amount.toFixed(2)), parseFloat(r.taxable_amount.toFixed(2)),
    r.gst_type,
    parseFloat(r.cgst_amount.toFixed(2)), parseFloat(r.sgst_amount.toFixed(2)),
    parseFloat(r.igst_amount.toFixed(2)), parseFloat(r.total_gst.toFixed(2)), parseFloat(r.total_amount.toFixed(2)),
    na(r.payment_method), na(r.razorpay_payment_id), na(r.coupon_code),
    na(r.category), na(r.verification_status),
    r.trust_score !== '' ? r.trust_score : 'NA', na(r.member_since),
  ])
  addDataSheet('Agencies', AGC_HDRS, agcData2, AGC_HDRS.map(() => 18))

  /* ════════════════════════════════════════════════
     SHEET 5 — GST TAX REPORT
  ════════════════════════════════════════════════ */
  const GST_HDRS = [
    'S.No','Profile No.','Subscriber Type','Name / Company',
    'GST Number','PAN Number','State','Country','GST Type',
    'Plan','Subscription Date','Taxable Amount (\u20b9)',
    'GST Rate (%)','CGST (\u20b9)','SGST (\u20b9)','IGST (\u20b9)','Total GST (\u20b9)','Total Invoice (\u20b9)',
    'Payment Method','Invoice Ref',
  ]
  const gstData2 = rows.map((r,i) => [
    i+1, na(r.profile_number), r.user_type, na(r.full_name),
    r.gst_number ? r.gst_number : 'N/A (B2C)', na(r.pan_number),
    na(r.state), na(r.country), r.gst_type,
    na(r.plan_name), na(r.subscribed_on),
    parseFloat(r.taxable_amount.toFixed(2)),
    r.gst_rate_pct,
    parseFloat(r.cgst_amount.toFixed(2)), parseFloat(r.sgst_amount.toFixed(2)),
    parseFloat(r.igst_amount.toFixed(2)), parseFloat(r.total_gst.toFixed(2)), parseFloat(r.total_amount.toFixed(2)),
    na(r.payment_method), na(r.razorpay_payment_id) !== 'NA' ? na(r.razorpay_payment_id) : na(r.transaction_id),
  ])
  const gstWs = addDataSheet('GST Tax Report', GST_HDRS, gstData2, [5,14,16,28,20,14,16,14,14,16,20,16,10,12,12,12,12,16,16,22])

  // Grand totals row — highlighted in gold
  const gstTotals = gstWs.addRow([
    'GRAND TOTAL', '', '', rows.length + ' transactions', '', '', '', '', '', '', '',
    parseFloat(sumX(rows, r=>r.taxable_amount).toFixed(2)), '',
    parseFloat(summary.totalCGST.toFixed(2)),
    parseFloat(summary.totalSGST.toFixed(2)),
    parseFloat(summary.totalIGST.toFixed(2)),
    parseFloat(summary.totalGST.toFixed(2)),
    parseFloat(summary.totalRevenue.toFixed(2)),
    '', '',
  ])
  gstTotals.height = 24
  gstTotals.eachCell({ includeEmpty: true }, (cell, colNum) => {
    const amtCols = [12, 14, 15, 16, 17, 18]
    const isAmt = amtCols.includes(colNum)
    if (isAmt && typeof cell.value === 'number') cell.numFmt = '#,##0.00'
    applyStyle(cell, { bold: true, size: 12, color: XL.black, bg: XL.gold, align: isAmt ? 'right' : 'left', border: true })
  })

  /* ── Write to buffer → Blob ── */
  const buffer = await wb.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

function na(v: any): string {
  if (v === null || v === undefined || v === '') return 'NA'
  if (typeof v === 'string' && v.trim() === '') return 'NA'
  return String(v)
}

function fmtAmt(n: number): string {
  return n.toFixed(2)
}


/* ─── Page ── */
export default function SubscriptionReportPage() {
  const router = useRouter()

  // Date range — default: current month
  const now = new Date()
  const defaultFrom = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
  const defaultTo   = now.toISOString().split('T')[0]

  const [fromDate,   setFromDate]   = useState(defaultFrom)
  const [toDate,     setToDate]     = useState(defaultTo)
  const [utype,      setUtype]      = useState('all')
  const [statusFilt, setStatusFilt] = useState('all')
  const [loading,    setLoading]    = useState(false)
  const [rows,       setRows]       = useState<Row[]>([])
  const [summary,    setSummary]    = useState<Summary|null>(null)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [generated,  setGenerated]  = useState(false)

  const fetchReport = useCallback(async () => {
    if (!fromDate || !toDate) return
    setLoading(true); setError(''); setGenerated(false)
    try {
      const token = getToken()
      const params = new URLSearchParams({ from: fromDate, to: toDate, type: utype, status: statusFilt })
      const res = await fetch(`/api/admin/reports/subscription?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed to generate report')
      setRows(d.rows || [])
      setSummary(d.summary || null)
      setGenerated(true)
    } catch(e:any) {
      setError(e.message || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate, utype, statusFilt])

  const downloadXLSX = useCallback(async () => {
    if (!rows.length || !summary) return
    try {
      const blob = await buildXLSX(rows, summary)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `SilverScreens_Subscription_Report_${summary.from}_to_${summary.to}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch(e) {
      console.error('Download error:', e)
    }
  }, [rows, summary])

  const filtered = rows.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.profile_number.toLowerCase().includes(q) ||
      r.plan_name.toLowerCase().includes(q)
  })

  const fmt = (n:number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const fmtRupee = (n:number) => `₹${fmt(n)}`
  const exactAsp = (f:(r:Row)=>number) => rows.filter(r=>r.user_type==='Aspirant').reduce((s,r)=>s+f(r),0)
  const exactAgc = (f:(r:Row)=>number) => rows.filter(r=>r.user_type==='Agency').reduce((s,r)=>s+f(r),0)
  const inp: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
    padding: '8px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    colorScheme: 'dark',
  }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as any }
  const card: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10, padding: 18,
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>
      <AdminTopnav/>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <AdminSidebar onCollapse={()=>{}}/>
        <div style={{flex:1,overflowY:'auto',padding:'18px 22px 40px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Breadcrumb + Header */}
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:5}}>
                <span onClick={()=>router.push('/admin/dashboard')} style={{cursor:'pointer'}}>Home</span>
                <ChevronRight size={12}/>
                <span onClick={()=>router.push('/admin/analytics')} style={{cursor:'pointer'}}>Analytics</span>
                <ChevronRight size={12}/>
                <span style={{color:'rgba(255,255,255,0.7)'}}>Subscription Report</span>
              </div>
              <h1 style={{fontFamily:BEBAS,fontSize:30,letterSpacing:1,margin:0,display:'flex',alignItems:'center',gap:8}}>
                <FileSpreadsheet size={24} color={GOLD}/>
                Subscription Revenue Report
              </h1>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:'3px 0 0'}}>
                Generate detailed subscription reports for GST filing, revenue analysis and audits.
              </p>
            </div>
            {generated && rows.length > 0 && (
              <button onClick={downloadXLSX}
                style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',background:GREEN,border:'none',borderRadius:8,color:'#000',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer',marginTop:28}}>
                <Download size={16}/> Download XLSX
              </button>
            )}
          </div>

          {/* ── Filter Card ── */}
          <div style={card}>
            <div style={{fontFamily:BEBAS,fontSize:18,letterSpacing:1,marginBottom:14,color:GOLD}}>
              <Filter size={14} style={{marginRight:6,verticalAlign:'middle'}}/>
              Report Filters
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr auto',gap:12,alignItems:'end'}}>
              <div>
                <label style={{fontSize:13,color:'rgba(255,255,255,0.45)',display:'block',marginBottom:5}}>From Date</label>
                <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} max={toDate} style={inp}/>
              </div>
              <div>
                <label style={{fontSize:13,color:'rgba(255,255,255,0.45)',display:'block',marginBottom:5}}>To Date</label>
                <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} min={fromDate} max={defaultTo} style={inp}/>
              </div>
              <div>
                <label style={{fontSize:13,color:'rgba(255,255,255,0.45)',display:'block',marginBottom:5}}>Subscriber Type</label>
                <select value={utype} onChange={e=>setUtype(e.target.value)} style={sel}>
                  <option value="all">All Types</option>
                  <option value="aspirant">Aspirants Only</option>
                  <option value="agency">Agencies Only</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:13,color:'rgba(255,255,255,0.45)',display:'block',marginBottom:5}}>Status</label>
                <select value={statusFilt} onChange={e=>setStatusFilt(e.target.value)} style={sel}>
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button onClick={fetchReport} disabled={loading}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 20px',background:loading?'rgba(212,166,74,0.3)':GOLD,border:'none',borderRadius:7,color:'#000',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:loading?'wait':'pointer',whiteSpace:'nowrap' as const}}>
                {loading ? <><RefreshCw size={15} style={{animation:'spin 1s linear infinite'}}/> Generating…</> : <><Search size={14}/> Generate Report</>}
              </button>
            </div>
            {/* Quick presets */}
            <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap' as const}}>
              {[
                {label:'This Month', from:`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`, to:defaultTo},
                {label:'Last Month', from:`${now.getFullYear()}-${String(now.getMonth()).padStart(2,'0')}-01`, to:`${now.getFullYear()}-${String(now.getMonth()).padStart(2,'0')}-${new Date(now.getFullYear(),now.getMonth(),0).getDate()}`},
                {label:'This Quarter', from:`${now.getFullYear()}-${String(Math.floor(now.getMonth()/3)*3+1).padStart(2,'0')}-01`, to:defaultTo},
                {label:'This FY', from:`${now.getMonth()>=3?now.getFullYear():now.getFullYear()-1}-04-01`, to:defaultTo},
                {label:'All Time', from:'2024-01-01', to:defaultTo},
              ].map(p=>(
                <button key={p.label} onClick={()=>{setFromDate(p.from);setToDate(p.to)}}
                  style={{padding:'5px 12px',background:BG4,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:13,cursor:'pointer'}}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',background:'rgba(200,32,42,0.12)',border:'1px solid rgba(200,32,42,0.3)',borderRadius:8,color:RED,fontSize:14}}>
              <AlertCircle size={16}/> {error}
            </div>
          )}

          {/* ── Summary Cards ── */}
          {generated && summary && (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                {[
                  {label:'Total Subscribers', value:summary.total,                    color:GOLD},
                  {label:'Aspirants',          value:summary.aspirantCount,            color:PURPLE},
                  {label:'Agencies',           value:summary.agencyCount,             color:BLUE},
                  {label:'Total Revenue',      value:fmtRupee(summary.totalRevenue),  color:GREEN},
                  {label:'Total GST',          value:fmtRupee(summary.totalGST),      color:ORANGE},
                  {label:'CGST+SGST (TN)',     value:fmtRupee(summary.totalCGST+summary.totalSGST), color:'#14B8A6'},
                  {label:'IGST (Other States)',value:fmtRupee(summary.totalIGST),    color:RED},
                  {label:'Taxable Amount',     value:fmtRupee(summary.totalBase),     color:'#F5F5F5'},
                ].map(s=>(
                  <div key={s.label} style={{...card,padding:'12px 14px'}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{s.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:22,color:s.color,letterSpacing:0.5}}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* GST Breakdown */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12}}>
                {[
                  {label:'Taxable Amount',  asp:exactAsp(r=>r.taxable_amount), agc:exactAgc(r=>r.taxable_amount), total:summary.totalBase},
                  {label:'CGST @ 9% (Intra-State)', asp:exactAsp(r=>r.cgst_amount), agc:exactAgc(r=>r.cgst_amount), total:summary.totalCGST},
                  {label:'SGST @ 9% (Intra-State)', asp:exactAsp(r=>r.sgst_amount), agc:exactAgc(r=>r.sgst_amount), total:summary.totalSGST},
                  {label:'IGST @ 18% (Inter-State)', asp:exactAsp(r=>r.igst_amount), agc:exactAgc(r=>r.igst_amount), total:summary.totalIGST},
                ].map(g=>(
                  <div key={g.label} style={card}>
                    <div style={{fontFamily:BEBAS,fontSize:16,letterSpacing:1,color:'rgba(255,255,255,0.5)',marginBottom:10}}>{g.label}</div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Aspirants</span>
                      <span style={{fontSize:14,fontWeight:700,color:PURPLE}}>₹{fmt(g.asp)}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Agencies</span>
                      <span style={{fontSize:14,fontWeight:700,color:BLUE}}>₹{fmt(g.agc)}</span>
                    </div>
                    <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'8px 0'}}/>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:13,fontWeight:700}}>Total</span>
                      <span style={{fontSize:16,fontFamily:BEBAS,color:GOLD,letterSpacing:0.5}}>₹{fmt(g.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Data Table Preview ── */}
          {generated && (
            <div style={card}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontFamily:BEBAS,fontSize:18,letterSpacing:1}}>Report Preview</span>
                  <span style={{background:`${GOLD}22`,color:GOLD,border:`1px solid ${GOLD}44`,borderRadius:12,fontSize:13,fontWeight:700,padding:'2px 10px'}}>
                    {filtered.length} records
                  </span>
                  {rows.length > 0 && (
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>
                      {summary?.from} — {summary?.to}
                    </span>
                  )}
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <div style={{position:'relative' as const}}>
                    <Search size={13} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)'}}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search name, email, profile…"
                      style={{...inp,width:220,paddingLeft:28}}/>
                  </div>
                  <button onClick={downloadXLSX} disabled={!rows.length}
                    style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:rows.length?GREEN:'rgba(34,197,94,0.2)',border:'none',borderRadius:7,color:rows.length?'#000':'rgba(255,255,255,0.3)',fontFamily:BEBAS,fontSize:16,letterSpacing:1,cursor:rows.length?'pointer':'default'}}>
                    <Download size={14}/> Download XLSX
                  </button>
                </div>
              </div>

              {rows.length === 0 ? (
                <div style={{padding:'48px',textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:15}}>
                  No subscriptions found for this period and filters.
                </div>
              ) : (
                <div style={{overflowX:'auto' as const}}>
                  <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:13,minWidth:900}}>
                    <thead>
                      <tr style={{background:'rgba(255,255,255,0.03)'}}>
                        {['#','Profile No.','Type','Name / Company','Email','Phone','Plan','Status',
                          'Start','End','Base (₹)','GST (₹)','Total (₹)','Payment','Subscribed On'].map(h=>(
                          <th key={h} style={{padding:'10px 10px',textAlign:'left' as const,fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.4,borderBottom:'1px solid rgba(255,255,255,0.06)',whiteSpace:'nowrap' as const}}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r,i)=>(
                        <tr key={r.sno}
                          style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.1s'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.4)'}}>{i+1}</td>
                          <td style={{padding:'9px 10px',fontWeight:600,color:GOLD}}>{r.profile_number}</td>
                          <td style={{padding:'9px 10px'}}>
                            <span style={{padding:'3px 8px',borderRadius:5,fontSize:12,fontWeight:700,
                              background:r.user_type==='Aspirant'?`${PURPLE}22`:`${BLUE}22`,
                              color:r.user_type==='Aspirant'?PURPLE:BLUE,
                              border:`1px solid ${r.user_type==='Aspirant'?PURPLE:BLUE}44`}}>
                              {r.user_type}
                            </span>
                          </td>
                          <td style={{padding:'9px 10px',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}} title={r.full_name}>{r.full_name}</td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.6)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{r.email}</td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.6)'}}>{r.phone}</td>
                          <td style={{padding:'9px 10px',fontWeight:600}}>{r.plan_name}</td>
                          <td style={{padding:'9px 10px'}}>
                            <span style={{padding:'3px 8px',borderRadius:5,fontSize:12,fontWeight:700,
                              background:r.subscription_status==='active'?`${GREEN}22`:`rgba(255,255,255,0.06)`,
                              color:r.subscription_status==='active'?GREEN:'rgba(255,255,255,0.5)',
                              border:`1px solid ${r.subscription_status==='active'?GREEN:'rgba(255,255,255,0.1)'}44`}}>
                              {r.subscription_status}
                            </span>
                          </td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.6)',whiteSpace:'nowrap' as const}}>{r.starts_at}</td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.6)',whiteSpace:'nowrap' as const}}>{r.ends_at}</td>
                          <td style={{padding:'9px 10px',textAlign:'right' as const}}>{fmt(r.base_amount)}</td>
                          <td style={{padding:'9px 10px',textAlign:'right' as const,color:ORANGE}}>{fmt(r.total_gst)}</td>
                          <td style={{padding:'9px 10px',textAlign:'right' as const,fontWeight:700,color:GREEN}}>{fmt(r.total_amount)}</td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.5)'}}>{r.payment_method||'—'}</td>
                          <td style={{padding:'9px 10px',color:'rgba(255,255,255,0.4)',whiteSpace:'nowrap' as const,fontSize:12}}>{r.subscribed_on}</td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr style={{background:'rgba(212,166,74,0.06)',borderTop:'2px solid rgba(212,166,74,0.2)'}}>
                        <td colSpan={10} style={{padding:'10px',fontFamily:BEBAS,fontSize:15,letterSpacing:0.5,color:GOLD}}>TOTALS ({filtered.length} records)</td>
                        <td style={{padding:'10px',textAlign:'right' as const,fontFamily:BEBAS,fontSize:15,color:'#F5F5F5'}}>
                          ₹{fmt(filtered.reduce((s,r)=>s+r.base_amount,0))}
                        </td>
                        <td style={{padding:'10px',textAlign:'right' as const,fontFamily:BEBAS,fontSize:15,color:ORANGE}}>
                          ₹{fmt(filtered.reduce((s,r)=>s+r.total_gst,0))}
                        </td>
                        <td style={{padding:'10px',textAlign:'right' as const,fontFamily:BEBAS,fontSize:15,color:GREEN}}>
                          ₹{fmt(filtered.reduce((s,r)=>s+r.total_amount,0))}
                        </td>
                        <td colSpan={2}/>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Info when not yet generated */}
          {!generated && !loading && !error && (
            <div style={{...card,padding:'48px',textAlign:'center' as const}}>
              <FileSpreadsheet size={40} color="rgba(255,255,255,0.15)" style={{margin:'0 auto 14px'}}/>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1,color:'rgba(255,255,255,0.25)',marginBottom:8}}>
                Set Filters & Generate Report
              </div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.3)'}}>
                Select date range, subscriber type and status above, then click Generate Report.<br/>
                The report will preview here and can be downloaded as a multi-sheet XLSX.
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}