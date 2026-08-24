'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'

const M    = "'Barlow Condensed', sans-serif"
const B    = "'Bebas Neue', sans-serif"
const GOLD = '#D4A64A'
const RED  = '#C8202A'

const PLANS: Record<string, { name: string; price: number; duration: string; type: string; features: string[] }> = {
  spotlight: { name: 'SPOTLIGHT', price: 299, duration: '3 Months', type: 'Aspirant', features: ['Full profile with photos & showreel','Apply to casting calls','Browse all talent listings','Direct messaging with studios','Profile analytics dashboard','SilverScreens verified badge'] },
  star:      { name: 'STAR',      price: 499, duration: '6 Months', type: 'Aspirant', features: ['Full profile with photos & showreel','Apply to casting calls','Browse all talent listings','Direct messaging with studios','Profile analytics dashboard','SilverScreens verified badge','Priority listing in search','Featured profile placement'] },
  icon:      { name: 'ICON',      price: 999, duration: '12 Months', type: 'Aspirant', features: ['Full profile with photos & showreel','Apply to casting calls','Browse all talent listings','Direct messaging with studios','Profile analytics dashboard','SilverScreens verified badge','Priority listing in search','Featured profile placement','Direct casting invites','Dedicated account manager'] },
  starter:   { name: 'STARTER',   price: 5999,  duration: '3 Months',  type: 'Agency', features: ['Post up to 5 casting calls','Basic talent search & filters','Up to 3 team members','Manage & track applications','Email support'] },
  growth:    { name: 'GROWTH',    price: 24999, duration: '6 Months',  type: 'Agency', features: ['Post up to 5 casting calls','Basic talent search & filters','Up to 3 team members','Manage & track applications','Email support','Advanced search filters','Up to 10 team members','Analytics dashboard'] },
  enterprise:{ name: 'ENTERPRISE',price: 99999, duration: '12 Months', type: 'Agency', features: ['Post up to 5 casting calls','Basic talent search & filters','Up to 3 team members','Manage & track applications','Email support','Advanced search filters','Up to 10 team members','Analytics dashboard','Unlimited casting calls','Dedicated account manager'] },
}

const RNR_PRICES: Record<string, { discounted: number; fullPrice: number; label: string }> = {
  spotlight: { discounted: 149, fullPrice: 297, label: '3 × ₹99/mo' },
  star:      { discounted: 250, fullPrice: 499, label: '6-month plan' },
  icon:      { discounted: 500, fullPrice: 999, label: 'Annual plan'  },
}

const CARDS = [{ id: 'visa', label: 'Visa' }, { id: 'mastercard', label: 'Mastercard' }, { id: 'rupay', label: 'RuPay' }]

const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 6, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }
const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: '#A8B0BD', letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' as const }

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function PaymentInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const planKey   = searchParams.get('plan')  || 'star'
  const withCombo = searchParams.get('combo') === 'true'
  const plan = PLANS[planKey] || PLANS.star
  const rnr  = withCombo ? RNR_PRICES[planKey] : null

  const [method,   setMethod]   = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card')
  const [cardType, setCardType] = useState('visa')
  const [form,     setForm]     = useState({ cardNumber: '', expiry: '', cvv: '', name: '', upiId: '', bank: '', wallet: '' })
  const [loading,  setLoading]  = useState(false)
  const [agree,    setAgree]    = useState(false)
  const [error,    setError]    = useState('')

  const subtotal = plan.price + (rnr ? rnr.discounted : 0)
  const gst      = Math.round(subtotal * 0.18)
  const total    = subtotal + gst

  const fmt          = (n: number) => `₹${n.toLocaleString('en-IN')}`
  const formatCard   = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d }

  const handlePay = async () => {
    if (!agree || loading) return
    setError('')
    setLoading(true)
    try {
      const sdkLoaded = await loadRazorpay()
      if (!sdkLoaded) { setError('Failed to load payment gateway. Please check your internet connection.'); setLoading(false); return }

      let token = ''
      try {
        const ssUser = JSON.parse(localStorage.getItem('ss_user') || '{}')
        token = ssUser.token || ''

        // Refresh token if expired or about to expire (within 5 mins)
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const expiresAt = payload.exp * 1000
            const fiveMinutes = 5 * 60 * 1000
            if (Date.now() > expiresAt - fiveMinutes) {
              const refreshRes = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: ssUser.refreshToken }),
              })
              if (refreshRes.ok) {
                const refreshData = await refreshRes.json()
                const newToken = refreshData.data?.access_token ?? refreshData.access_token
                const newRefresh = refreshData.data?.refresh_token ?? refreshData.refresh_token
                if (newToken) {
                  token = newToken
                  localStorage.setItem('ss_user', JSON.stringify({
                    ...ssUser,
                    token: newToken,
                    refreshToken: newRefresh || ssUser.refreshToken,
                  }))
                }
              }
            }
          } catch {}
        }
      } catch {}

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ plan_key: planKey, with_rnr_addon: withCombo, amount: total }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) { setError(orderData.error || orderData.message || 'Could not create payment order. Please try again.'); setLoading(false); return }

      const { order_id: orderId, amount: orderAmount, currency = 'INR', razorpay_key: keyId, user, subscription_id } = orderData.data ?? orderData

      const options = {
        key: keyId, amount: orderAmount, currency,
        name: 'SilverScreens',
        description: `${plan.name} Plan — ${plan.duration}`,
        order_id: orderId,
        prefill: { name: user?.name || '', email: user?.email || '', contact: user?.phone || '' },
        theme: { color: GOLD },
        modal: {
          ondismiss: () => { setLoading(false); setError('Payment cancelled. Please try again when you are ready.') },
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, plan_key: planKey, with_rnr_addon: withCombo, subscription_id }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) {
              setError(verifyData.error || verifyData.message || 'Payment verification failed. Contact support.')
              setLoading(false)
              router.push(`/payment-failure?plan=${planKey}&amount=${total}${withCombo ? '&combo=true' : ''}`)
              return
            }
            try {
              const ssUser = JSON.parse(localStorage.getItem('ss_user') || '{}')
              localStorage.setItem('ss_user', JSON.stringify({ ...ssUser, subscribed: true, plan: planKey, planName: plan.name, paidAt: new Date().toISOString() }))
            } catch {}
            router.push(`/payment-success?plan=${planKey}&amount=${total}${withCombo ? '&combo=true' : ''}`)
          } catch { setError('Network error during verification. Please contact support with your payment ID.'); setLoading(false) }
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', (response: any) => {
        setError(`Payment failed: ${response.error?.description || 'Unknown error'}`)
        setLoading(false)
        router.push(`/payment-failure?plan=${planKey}&amount=${total}${withCombo ? '&combo=true' : ''}`)
      })
      rzp.open()
    } catch { setError('Something went wrong. Please try again.'); setLoading(false) }
  }

  return (
    <>
      <PublicNavbar />
      <div style={{ background: '#050505', minHeight: '100vh', fontFamily: M, color: '#F5F5F5', paddingTop: 80 }}>
        <div style={{ borderBottom: '1px solid rgba(212,166,74,0.1)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: GOLD, fontWeight: 700, textTransform: 'uppercase' as const }}>Secure Checkout</span>
            </div>
            <h1 style={{ fontFamily: B, fontSize: 36, letterSpacing: 3, color: '#F5F5F5', margin: 0 }}>COMPLETE PAYMENT</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 8, padding: '10px 18px' }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>256-bit SSL Encrypted</span>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: '#0B0F14', border: '1px solid rgba(212,166,74,0.12)', borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20, minHeight: 300 }}>
              <div style={{ fontSize: 48 }}>🔒</div>
              <div style={{ fontFamily: B, fontSize: 22, letterSpacing: 2, color: '#F5F5F5' }}>SECURE PAYMENT</div>
              <div style={{ fontFamily: M, fontSize: 15, color: '#A8B0BD', lineHeight: 1.7, maxWidth: 380 }}>
                Click the <strong style={{ color: GOLD }}>Pay Now</strong> button to complete your payment securely via Razorpay.<br /><br />
                You can pay using <strong style={{ color: '#F5F5F5' }}>Credit/Debit Card, UPI, Net Banking, or Wallet</strong> — all options are available on the payment screen.
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                {['💳 Cards', '📱 UPI', '🏦 Net Banking', '👛 Wallets'].map(m => (
                  <span key={m} style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.15)', color: GOLD, fontFamily: M, fontSize: 14 }}>{m}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                {['🛡️ 256-bit SSL', '✅ RBI Compliant', '🔄 Instant Confirmation'].map(b => (
                  <span key={b} style={{ fontFamily: M, fontSize: 13, color: '#6A7080' }}>{b}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <button onClick={() => setAgree(!agree)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `1px solid ${agree ? GOLD : 'rgba(212,166,74,0.3)'}`, background: agree ? GOLD : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {agree && <span style={{ color: '#050505', fontSize: 14, fontWeight: 900 }}>✓</span>}
              </button>
              <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.6 }}>
                I agree to the <span style={{ color: GOLD, cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: GOLD, cursor: 'pointer' }}>Privacy Policy</span>. By proceeding, I authorise SilverScreens to charge {fmt(total)} to my selected payment method.
              </span>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <span style={{ fontFamily: M, fontSize: 14, color: '#fca5a5' }}>{error}</span>
              </div>
            )}
          </div>

          <div style={{ background: '#0B0F14', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 12, padding: 24, position: 'sticky' as const, top: 100 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{plan.type === 'Aspirant' ? '🎭' : '🏢'}</div>
                <div>
                  <div style={{ fontFamily: B, fontSize: 22, letterSpacing: 2, color: '#F5F5F5' }}>{plan.name} PLAN</div>
                  <div style={{ fontFamily: M, fontSize: 14, color: GOLD, fontWeight: 600 }}>{plan.type} · {plan.duration}</div>
                </div>
              </div>
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#6A7080', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 }}>Includes</div>
                {plan.features.map(ft => (
                  <div key={ft} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: GOLD, fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>{ft}</span>
                  </div>
                ))}
              </div>
              {rnr && (
                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(212,166,74,0.04)', borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>💍</span>
                    <span style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: GOLD }}>RingsNRoses Bronze</span>
                    <span style={{ marginLeft: 'auto', fontFamily: M, fontSize: 13, background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '2px 8px' }}>50% OFF</span>
                  </div>
                  <div style={{ fontFamily: M, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{rnr.label} · Wedding vendor profile</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: M, fontSize: 14, color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{fmt(rnr.fullPrice)}</span>
                    <span style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: GOLD }}>{fmt(rnr.discounted)}</span>
                    <span style={{ fontFamily: M, fontSize: 13, color: '#4ade80', marginLeft: 4 }}>You save {fmt(rnr.fullPrice - rnr.discounted)}</span>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>SilverScreens {plan.name} ({plan.duration})</span><span style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5' }}>{fmt(plan.price)}</span></div>
                {rnr && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>RingsNRoses Bronze ({rnr.label})</span><span style={{ fontFamily: M, fontSize: 14, color: GOLD }}>{fmt(rnr.discounted)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}><span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>Subtotal</span><span style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5' }}>{fmt(subtotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>GST (18%)</span><span style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5' }}>{fmt(gst)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}><span style={{ fontFamily: B, fontSize: 18, letterSpacing: 1, color: '#F5F5F5' }}>TOTAL</span><span style={{ fontFamily: B, fontSize: 30, letterSpacing: 1, color: GOLD }}>{fmt(total)}</span></div>
              </div>
              <button onClick={handlePay} disabled={!agree || loading} style={{ width: '100%', padding: '15px', background: agree && !loading ? GOLD : 'rgba(212,166,74,0.3)', border: 'none', borderRadius: 8, cursor: agree && !loading ? 'pointer' : 'not-allowed', fontFamily: B, fontSize: 22, letterSpacing: 3, color: '#050505', boxShadow: agree && !loading ? '0 8px 28px rgba(212,166,74,0.3)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? <><span style={{ fontSize: 18, display: 'inline-block', animation: 'spin 1s linear infinite' }}>{'\u27F3'}</span> PROCESSING...</> : <>{'\uD83D\uDD12'} PAY {fmt(total)}</>}
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
                {['🛡️ Secure', '🔄 Cancel Anytime', '🎧 24/7 Support'].map(b => (<span key={b} style={{ fontFamily: M, fontSize: 13, color: '#6A7080' }}>{b}</span>))}
              </div>
            </div>
          </div>
        </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}} />
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', minHeight: '100vh' }} />}>
      <PaymentInner />
    </Suspense>
  )
}