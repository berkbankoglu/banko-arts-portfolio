'use client'

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.message.trim() || formData.message.trim().length < 10) e.message = 'Message is required (min 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        { from_name: formData.name, from_email: formData.email, message: formData.message, to_name: 'Banko Arts' },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (ev) => {
    setFormData(prev => ({ ...prev, [ev.target.name]: ev.target.value }));
    if (errors[ev.target.name]) setErrors(prev => ({ ...prev, [ev.target.name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="ba-label">Name *</label>
          <input
            className={`ba-input${errors.name ? ' ba-input--error' : ''}`}
            name="name" type="text" value={formData.name} onChange={handleChange}
            placeholder="Your name" disabled={status === 'sending'}
          />
          {errors.name && <p style={{ color: 'rgba(220,80,80,0.9)', fontSize: 11, marginTop: 6 }}>{errors.name}</p>}
        </div>
        <div>
          <label className="ba-label">Email *</label>
          <input
            className={`ba-input${errors.email ? ' ba-input--error' : ''}`}
            name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="your@email.com" disabled={status === 'sending'}
          />
          {errors.email && <p style={{ color: 'rgba(220,80,80,0.9)', fontSize: 11, marginTop: 6 }}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="ba-label">Message *</label>
        <textarea
          className={`ba-input${errors.message ? ' ba-input--error' : ''}`}
          name="message" value={formData.message} onChange={handleChange}
          placeholder="Tell us about your project…" rows={6}
          disabled={status === 'sending'}
          style={{ resize: 'vertical' }}
        />
        {errors.message && <p style={{ color: 'rgba(220,80,80,0.9)', fontSize: 11, marginTop: 6 }}>{errors.message}</p>}
      </div>

      {status === 'success' && (
        <p style={{ fontSize: 13, color: 'rgba(100,200,120,0.9)', border: '1px solid rgba(100,200,120,0.2)', padding: '12px 16px' }}>
          Message sent — we'll get back to you within 24 hours.
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: 13, color: 'rgba(220,80,80,0.9)', border: '1px solid rgba(220,80,80,0.2)', padding: '12px 16px' }}>
          Something went wrong. Please email us directly at info@bankoarts.com
        </p>
      )}

      <button type="submit" className="ba-btn-primary" disabled={status === 'sending'} style={{ width: '100%' }}>
        {status === 'sending' ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  );
}
