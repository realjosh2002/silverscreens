'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const BG2   = '#131720';
const BG3   = '#181E2A';
const RED   = '#EF4444';
const GREEN = '#22C55E';
const GOLD  = '#D4A64A';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW= "'Barlow Condensed', sans-serif";

const REASONS = [
  { label: 'Fake or misleading profile', value: 'fake_profile'          },
  { label: 'Scam casting call',          value: 'scam_casting'          },
  { label: 'Inappropriate content',      value: 'inappropriate_content' },
  { label: 'Harassment or abuse',        value: 'harassment'            },
  { label: 'Fraud / Payment scam',       value: 'fraud'                 },
  { label: 'Other',                      value: 'other'                 },
];

interface Props {
  isOpen:           boolean;
  onClose:          () => void;
  entityName:       string;           // e.g. "DreamWorks Films" or "Lead Role - Web Series"
  reportedUserId?:  string | null;    // profiles.id of the reported user
  entityType:       'user' | 'agency' | 'casting_call' | 'message';
  entityId:         string;           // aspirant_profiles.id or casting_calls.id
}

function getToken(): string {
  try { return JSON.parse(localStorage.getItem('ss_user') || '{}').token || ''; }
  catch { return ''; }
}

export default function ReportModal({ isOpen, onClose, entityName, reportedUserId, entityType, entityId }: Props) {
  const [reason,      setReason]      = useState('');
  const [description, setDescription] = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    setReason(''); setDescription(''); setDone(false); setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true); setError('');
    try {
      const token = getToken();
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          reported_user_id:     reportedUserId || null,
          reported_entity_type: entityType,
          reported_entity_id:   entityId,
          reason,
          description: description.trim() || `Reported ${entityType}: ${entityName}. Reason: ${reason}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:500,backdropFilter:'blur(4px)' }}/>

      {/* Modal */}
      <div style={{ position:'fixed',inset:0,zIndex:501,display:'flex',alignItems:'center',justifyContent:'center',padding:20,pointerEvents:'none' }}>
        <div style={{ background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:460,pointerEvents:'all',boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}>

          {/* Header */}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily:BEBAS,fontSize:22,letterSpacing:1,color:'#F5F5F5' }}>
              {done ? 'Report Submitted' : 'Report Profile'}
            </div>
            <button onClick={handleClose} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex',alignItems:'center' }}>
              <X size={18}/>
            </button>
          </div>

          <div style={{ padding:'20px 22px' }}>
            {done ? (
              /* Success state */
              <div style={{ textAlign:'center',padding:'16px 0' }}>
                <div style={{ width:56,height:56,borderRadius:'50%',background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px' }}>
                  <CheckCircle size={28} color={GREEN}/>
                </div>
                <div style={{ fontFamily:BARLOW,fontSize:16,fontWeight:700,color:'#F5F5F5',marginBottom:8 }}>Thank you for your report</div>
                <div style={{ fontFamily:BARLOW,fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.6,marginBottom:24 }}>
                  Our team will review this report and take appropriate action within 24–48 hours.
                </div>
                <button onClick={handleClose} style={{ background:GOLD,border:'none',borderRadius:8,padding:'10px 32px',color:'#000',fontFamily:BEBAS,fontSize:17,letterSpacing:1,cursor:'pointer' }}>
                  DONE
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                <div style={{ fontFamily:BARLOW,fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:18 }}>
                  Reporting: <strong style={{ color:'#F5F5F5' }}>{entityName}</strong>
                </div>

                {/* Reason selection */}
                <div style={{ fontFamily:BARLOW,fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:10 }}>
                  Reason for reporting <span style={{ color:RED }}>*</span>
                </div>
                <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:16 }}>
                  {REASONS.map(r => (
                    <div key={r.value} onClick={() => setReason(r.value)}
                      style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,border:`1px solid ${reason===r.value?RED:'rgba(255,255,255,0.1)'}`,background:reason===r.value?'rgba(239,68,68,0.08)':'transparent',cursor:'pointer',transition:'all 0.15s' }}>
                      <div style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${reason===r.value?RED:'rgba(255,255,255,0.3)'}`,background:reason===r.value?RED:'transparent',flexShrink:0,transition:'all 0.15s' }}/>
                      <span style={{ fontFamily:BARLOW,fontSize:14,color:reason===r.value?'#F5F5F5':'rgba(255,255,255,0.6)' }}>{r.label}</span>
                    </div>
                  ))}
                </div>

                {/* Optional description */}
                <div style={{ fontFamily:BARLOW,fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:8 }}>
                  Additional details <span style={{ color:'rgba(255,255,255,0.3)',fontWeight:400 }}>(optional)</span>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what happened…"
                  maxLength={500}
                  rows={3}
                  style={{ width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',resize:'none',boxSizing:'border-box',marginBottom:4 }}
                />
                <div style={{ fontSize:13,color:'rgba(255,255,255,0.3)',textAlign:'right',marginBottom:16 }}>{description.length}/500</div>

                {/* Error */}
                {error && (
                  <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,padding:'10px 14px',fontSize:14,color:RED,marginBottom:14,fontFamily:BARLOW }}>
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display:'flex',gap:10 }}>
                  <button onClick={handleClose} disabled={submitting}
                    style={{ flex:1,padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={!reason||submitting}
                    style={{ flex:2,padding:'10px',background:reason&&!submitting?RED:'rgba(239,68,68,0.3)',border:'none',borderRadius:8,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:reason&&!submitting?'pointer':'default',transition:'background 0.15s' }}>
                    {submitting ? 'SUBMITTING…' : 'SUBMIT REPORT'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}