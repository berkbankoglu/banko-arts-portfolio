'use client'

import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errors, setErrors] = useState({});

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setStatus('sending');

        try {
            // EmailJS configuration
            // Replace these with your actual EmailJS credentials
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

            // Send email using EmailJS
            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_name: 'Banko Arts', // Your name
                },
                publicKey
            );

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setErrors({});
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-8">
            <div className="bg-neutral-900/50 border border-white/10 p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm text-white/60 mb-2 tracking-wider">
                                NAME *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={status === 'sending'}
                                className={`w-full px-4 py-3 bg-neutral-900 border ${errors.name ? 'border-red-500' : 'border-white/10'} text-white focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50`}
                                placeholder="Your name"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-white/60 mb-2 tracking-wider">
                                EMAIL *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={status === 'sending'}
                                className={`w-full px-4 py-3 bg-neutral-900 border ${errors.email ? 'border-red-500' : 'border-white/10'} text-white focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm text-white/60 mb-2 tracking-wider">
                            MESSAGE *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            disabled={status === 'sending'}
                            rows="6"
                            className={`w-full px-4 py-3 bg-neutral-900 border ${errors.message ? 'border-red-500' : 'border-white/10'} text-white focus:border-white/30 focus:outline-none transition-colors resize-none disabled:opacity-50`}
                            placeholder="Tell me about your project..."
                        />
                        {errors.message && (
                            <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                        )}
                    </div>

                    {status === 'success' && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 px-4 py-3">
                            <CheckCircle size={20} />
                            <span>Message sent successfully! I'll get back to you soon.</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
                            <AlertCircle size={20} />
                            <span>Failed to send message. Please try again or email directly.</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full py-4 bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-3 text-sm tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}
                        >
                            {status === 'sending' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    <span>SENDING...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>SEND MESSAGE</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
