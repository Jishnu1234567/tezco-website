"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Send, Github, Twitter, Linkedin, Mail, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser"; // You'll need to install this: npm install @emailjs/browser

export default function ContactFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Replace these with your EmailJS credentials
    // Get them at https://dashboard.emailjs.com/
    const SERVICE_ID = "service_vkeiurj";
    const TEMPLATE_ID = "template_8xz6hqj";
    const PUBLIC_KEY = "a6xluLLsf0Mq6ANSd";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(() => {
        setStatus("Message sent successfully!");
        formRef.current?.reset();
      }, (error) => {
        setStatus("Failed to send. Please try again.");
        console.error(error.text);
      })
      .finally(() => {
        setIsSending(false);
        setTimeout(() => setStatus(""), 5000);
      });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <section ref={footerRef} className="relative bg-[#050505] pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -mr-64 -mt-64" />
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          
          <div className="flex flex-col justify-between">
            <div>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="text-blue-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">
                Inquiry Terminal
              </motion.span>
              <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-8">
                LET'S <br /> <span className="text-blue-600">CONNECT.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Ready to build the next generation of architectural infrastructure? Reach out and let's deploy something amazing.
              </p>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4 text-gray-300 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:border-blue-500/50 transition-colors">
                  <Mail size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Email us</p>
                  <p className="text-lg font-medium">hello@tezco.studio</p>
                </div>
              </div>
               <div className="flex items-center gap-4 text-gray-300 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:border-red-500/50 transition-colors">
                  <MapPin size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Location</p>
                  <p className="text-lg font-medium">Aluva / Ernakulam</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-3xl" />
            <form ref={formRef} onSubmit={sendEmail} className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-12 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Name</label>
                  <input name="user_name" required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">User Email</label>
                  <input name="user_email" required type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Message</label>
                <textarea name="message" required rows={4} placeholder="Tell us about your vision..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none" />
              </div>

              <button 
                disabled={isSending}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative w-full py-4 bg-blue-600 text-white font-bold rounded-xl overflow-hidden flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span className="relative z-10">{isSending ? "SENDING..." : "SEND MESSAGE"}</span>
                {!isSending && <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
              {status && <p className="text-center mt-4 text-xs tracking-widest text-blue-400 animate-pulse uppercase">{status}</p>}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white text-2xl font-black tracking-tighter">TEZ<span className="text-blue-600">CO</span></div>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">© 2026 TEZCO SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </section>
  );
}