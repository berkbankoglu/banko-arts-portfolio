'use client'

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const PROJECT_TYPES = ['Exterior Rendering', 'Interior Rendering', 'Animation', '3D Modeling', 'Master Plan', 'Other'];
const SCALES = ['Single Unit / Apartment', 'Residential House', 'Villa / Mansion', 'Small Commercial', 'Mid-Rise Building', 'High-Rise / Tower', 'Large Complex'];
const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000+', 'Not sure yet'];

const TABS = ['Design Projects', 'Consulting', 'Other'];

const EMPTY = {
  firstName: '', lastName: '', email: '', company: '',
  projectType: '', location: '', scale: '', budget: '', overview: '',
  subject: '', message: '',
};

export default function ContactForm() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (tab === 0) {
      if (!formData.projectType) e.projectType = 'Required';
      if (!formData.overview.trim() || formData.overview.trim().length < 10) e.overview = 'Please describe your project (min 10 chars)';
    } else {
      if (!formData.message.trim() || formData.message.trim().length < 10) e.message = 'Required (min 10 chars)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const templateParams = {
      tab: TABS[tab],
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      company: formData.company || '—',
      project_type: formData.projectType || '—',
      location: formData.location || '—',
      scale: formData.scale || '—',
      budget: formData.budget || '—',
      message: formData.overview || formData.message,
      to_name: 'Banko Arts',
    };
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );
      setStatus('success');
      setFormData(EMPTY);
      setErrors({});
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inp = (name, type = 'text', placeholder = '') => (
    <input
      className={`ba-input${errors[name] ? ' ba-input--error' : ''}`}
      name={name} type={type} value={formData[name]}
      onChange={handleChange} placeholder={placeholder}
      disabled={status === 'sending'}
    />
  );

  const sel = (name, placeholder, options) => (
    <select
      className={`ba-input${errors[name] ? ' ba-input--error' : ''}`}
      name={name} value={formData[name]} onChange={handleChange}
      disabled={status === 'sending'}
      style={{ color: formData[name] ? 'var(--black)' : 'var(--muted)' }}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  const err = (name) => errors[name]
    ? <p style={{ color:'rgba(220,80,80,0.9)', fontSize:11, marginTop:4 }}>{errors[name]}</p>
    : null;

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>

      {/* Tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', border:'1px solid var(--border)', marginBottom:24 }}>
        {TABS.map((t, i) => (
          <button key={t} type="button" onClick={() => { setTab(i); setErrors({}); }}
            style={{
              padding:'12px 8px', border:'none', borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              background: tab === i ? '#fff' : '#f5f5f5',
              fontFamily:'var(--font)', fontSize:12, fontWeight: tab === i ? 700 : 400,
              letterSpacing:'0.04em', color: tab === i ? 'var(--black)' : 'var(--muted)',
              cursor:'pointer', transition:'background 0.2s, color 0.2s',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* First / Last */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label className="ba-label">First Name *</label>
            {inp('firstName', 'text', 'Jane')}
            {err('firstName')}
          </div>
          <div>
            <label className="ba-label">Last Name *</label>
            {inp('lastName', 'text', 'Smith')}
            {err('lastName')}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="ba-label">Email *</label>
          {inp('email', 'email', 'jane@brand.com')}
          {err('email')}
        </div>

        {/* Company */}
        <div>
          <label className="ba-label">Brand / Company</label>
          {inp('company', 'text', 'Acme Retail Co.')}
        </div>

        {tab === 0 && (<>
          {/* Project Type */}
          <div>
            <label className="ba-label">Project Type *</label>
            {sel('projectType', 'Select type...', PROJECT_TYPES)}
            {err('projectType')}
          </div>

          {/* Location */}
          <div>
            <label className="ba-label">Location</label>
            {inp('location', 'text', 'City, Country')}
          </div>

          {/* Scale + Budget */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="ba-label">Project Scale</label>
              {sel('scale', 'Select scale...', SCALES)}
            </div>
            <div>
              <label className="ba-label">Approximate Budget</label>
              {sel('budget', 'Select range...', BUDGETS)}
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="ba-label">Project Overview *</label>
            <textarea
              className={`ba-input${errors.overview ? ' ba-input--error' : ''}`}
              name="overview" value={formData.overview} onChange={handleChange}
              placeholder="Tell us about the concept, location, scale, and any timelines…"
              rows={5} disabled={status === 'sending'} style={{ resize:'vertical' }}
            />
            {err('overview')}
          </div>
        </>)}

        {tab !== 0 && (
          <div>
            <label className="ba-label">Message *</label>
            <textarea
              className={`ba-input${errors.message ? ' ba-input--error' : ''}`}
              name="message" value={formData.message} onChange={handleChange}
              placeholder={tab === 1 ? 'What would you like to consult about?' : 'How can we help?'}
              rows={6} disabled={status === 'sending'} style={{ resize:'vertical' }}
            />
            {err('message')}
          </div>
        )}

        {status === 'success' && (
          <p style={{ fontSize:13, color:'rgba(100,200,120,0.9)', border:'1px solid rgba(100,200,120,0.2)', padding:'12px 16px' }}>
            Message sent — we'll get back to you within 24 hours.
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontSize:13, color:'rgba(220,80,80,0.9)', border:'1px solid rgba(220,80,80,0.2)', padding:'12px 16px' }}>
            Something went wrong. Please email us directly at info@bankoarts.com
          </p>
        )}

        <button type="submit" className="ba-btn-primary" disabled={status === 'sending'} style={{ width:'100%', marginTop:4 }}>
          {status === 'sending' ? 'Sending…' : 'Send Inquiry →'}
        </button>
      </div>
    </form>
  );
}
