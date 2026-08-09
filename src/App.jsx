import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

// ── Design Tokens ──────────────────────────────────────────────
const NAVY   = "#1B3A5C";
const GOLD   = "#C8962E";
const CREAM  = "#FAFAFA";
const SLATE  = "#8A9BB0";
const GRAY   = "#444444";
const LTBLUE = "#D6E4F0";
const LTGOLD = "#FDF3E0";
const WHITE  = "#FFFFFF";
const DKNAVY = "#0F2035";

const EFFECTIVE_DATE = "August 9, 2026";
const CONTACT_EMAIL  = "privacy@laddacademy.com";

// ── Shared CSS ─────────────────────────────────────────────────
const sharedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: ${CREAM};
    color: ${GRAY};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  a { text-decoration: none; }

  /* ── Topbar ── */
  .topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 18px 48px;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.3s, box-shadow 0.3s;
  }
  .topbar.scrolled {
    background: rgba(27,58,92,0.97);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 24px rgba(0,0,0,0.2);
  }
  .topbar.solid {
    background: ${NAVY};
    border-bottom: 3px solid ${GOLD};
    position: sticky;
  }
  .topbar-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
  .topbar-wordmark { display: flex; flex-direction: column; gap: 1px; }
  .topbar-brand { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${GOLD}; }
  .topbar-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: ${WHITE}; line-height: 1; }
  .topbar-nav { display: flex; align-items: center; gap: 32px; }
  .topbar-link { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); text-decoration: none; letter-spacing: 0.3px; transition: color 0.15s; }
  .topbar-link:hover { color: ${WHITE}; }
  .topbar-cta {
    background: ${GOLD}; color: ${WHITE};
    padding: 10px 22px; border-radius: 6px;
    font-size: 13px; font-weight: 600;
    text-decoration: none; letter-spacing: 0.3px;
    transition: background 0.15s, transform 0.15s;
    border: none; cursor: pointer; font-family: inherit;
  }
  .topbar-cta:hover { background: #b8851e; transform: translateY(-1px); }
  .topbar-back { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.15s; }
  .topbar-back:hover { color: ${WHITE}; }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    background: ${NAVY};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 120px 24px 80px;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(200,150,46,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(200,150,46,0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  .hero-question { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(24px, 4vw, 48px); color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 40px; max-width: 640px; line-height: 1.3; animation: fadeUp 1s ease both; }
  .hero-divider { width: 48px; height: 2px; background: ${GOLD}; margin: 0 auto 40px; animation: fadeUp 1s ease 0.15s both; }
  .hero-headline { font-family: 'Playfair Display', serif; font-size: clamp(44px, 8vw, 96px); font-weight: 900; color: ${WHITE}; text-align: center; line-height: 1.0; letter-spacing: -2px; max-width: 900px; margin-bottom: 16px; animation: fadeUp 1s ease 0.25s both; }
  .hero-headline em { color: ${GOLD}; font-style: italic; }
  .hero-tagline { font-size: clamp(13px, 1.5vw, 16px); color: ${SLATE}; text-align: center; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; margin-bottom: 48px; animation: fadeUp 1s ease 0.35s both; }
  .hero-sub { font-size: clamp(15px, 1.8vw, 19px); color: rgba(255,255,255,0.65); text-align: center; line-height: 1.75; max-width: 580px; margin-bottom: 56px; animation: fadeUp 1s ease 0.45s both; }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; animation: fadeUp 1s ease 0.55s both; }
  .hero-scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; animation: fadeUp 1s ease 0.8s both; }
  .hero-scroll-text { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .hero-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(200,150,46,0.6), transparent); animation: scrollPulse 2s ease-in-out infinite; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scrollPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  /* ── Buttons ── */
  .btn-primary { background: ${GOLD}; color: ${WHITE}; padding: 18px 44px; border-radius: 8px; font-size: 16px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px; transition: all 0.2s; box-shadow: 0 4px 24px rgba(200,150,46,0.35); border: none; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary:hover { background: #b8851e; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,150,46,0.45); }
  .btn-outline-light { background: transparent; color: ${WHITE}; padding: 18px 44px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; letter-spacing: 0.3px; border: 2px solid rgba(255,255,255,0.25); transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-outline-light:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

  /* ── Sections ── */
  .section { padding: 100px 24px; }
  .section-inner { max-width: 1080px; margin: 0 auto; }
  .section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; display: block; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4vw, 52px); font-weight: 700; color: ${NAVY}; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1px; }
  .section-title em { font-style: italic; color: ${GOLD}; }
  .section-body { font-size: 18px; line-height: 1.8; color: #555; max-width: 620px; }

  /* ── What We Do cards ── */
  .what-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 64px; align-items: stretch; }
  .what-card { background: ${WHITE}; border-radius: 16px; padding: 36px 32px; box-shadow: 0 2px 20px rgba(27,58,92,0.06); border: 1px solid #EEF2F7; transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; display: flex; flex-direction: column; height: 100%; }
  .what-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${GOLD}; transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
  .what-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(27,58,92,0.12); }
  .what-card:hover::before { transform: scaleX(1); }
  .what-icon { font-size: 32px; margin-bottom: 20px; display: block; }
  .what-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: ${NAVY}; margin-bottom: 12px; }
  .what-text { font-size: 15px; line-height: 1.7; color: #666; margin-bottom: 20px; flex: 1; }
  .what-link { font-size: 13px; font-weight: 600; color: ${GOLD}; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: gap 0.2s; }
  .what-link:hover { gap: 10px; }

  /* ── CORE Blueprint featured ── */
  .featured { background: ${DKNAVY}; }
  .featured-inner { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .featured-dims { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
  .featured-dim { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; transition: background 0.2s; }
  .featured-dim:hover { background: rgba(200,150,46,0.1); }
  .featured-dim-letter { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: ${GOLD}; margin-bottom: 4px; }
  .featured-dim-name { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
  .featured-dim-desc { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.5; }
  .featured-right { display: flex; flex-direction: column; gap: 20px; }
  .featured-report-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; }
  .featured-report-tier { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 10px; }
  .featured-report-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: ${WHITE}; margin-bottom: 12px; }
  .featured-report-items { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .featured-report-item { font-size: 13px; color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 8px; }
  .featured-report-item::before { content: '✦'; color: ${GOLD}; font-size: 10px; flex-shrink: 0; }
  .featured-price { display: flex; align-items: baseline; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .featured-price-free { font-size: 22px; font-weight: 700; color: ${WHITE}; }
  .featured-price-paid { font-size: 28px; font-weight: 700; color: ${WHITE}; }
  .featured-price-note { font-size: 13px; color: rgba(255,255,255,0.4); }

  /* ── About ── */
  .about-inner { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; align-items: start; }
  .about-credentials { display: flex; flex-direction: column; gap: 16px; margin-top: 36px; }
  .about-cred { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; background: ${CREAM}; border-radius: 10px; border-left: 3px solid ${GOLD}; }
  .about-cred-icon { font-size: 20px; flex-shrink: 0; }
  .about-cred-text { font-size: 14px; color: #555; line-height: 1.5; }
  .about-cred-text strong { color: ${NAVY}; display: block; margin-bottom: 2px; font-size: 13px; font-weight: 700; }
  .about-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(20px, 2.5vw, 30px); color: ${NAVY}; line-height: 1.4; margin-bottom: 28px; }
  .about-quote-attr { font-size: 13px; font-weight: 600; color: ${SLATE}; letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 12px; }
  .about-quote-attr::before { content: ''; display: block; width: 32px; height: 2px; background: ${GOLD}; }

  /* ── Products ── */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 56px; align-items: stretch; }
  .product-card { background: ${WHITE}; border-radius: 14px; padding: 28px; box-shadow: 0 1px 12px rgba(27,58,92,0.06); display: flex; flex-direction: column; border: 1px solid #EEF2F7; transition: transform 0.2s, box-shadow 0.2s; height: 100%; }
  .product-card:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(27,58,92,0.1); }
  .product-status { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 20px; padding: 3px 10px; margin-bottom: 16px; align-self: flex-start; }
  .status-live  { background: #E8F5E9; color: #2E7D32; }
  .status-soon  { background: ${LTGOLD}; color: #8B6914; }
  .status-dev   { background: ${LTBLUE}; color: ${NAVY}; }
  .product-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: ${NAVY}; margin-bottom: 10px; }
  .product-text { font-size: 14px; color: #666; line-height: 1.65; flex: 1; margin-bottom: 20px; }
  .product-action { font-size: 13px; font-weight: 600; color: ${GOLD}; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: gap 0.2s; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
  .product-action:hover { gap: 10px; }

  /* ── Mission ── */
  .mission { background: ${LTGOLD}; border-top: 3px solid ${GOLD}; border-bottom: 3px solid ${GOLD}; }
  .mission-inner { max-width: 800px; margin: 0 auto; text-align: center; }
  .mission-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(20px, 3vw, 36px); color: ${NAVY}; line-height: 1.45; margin-bottom: 28px; }
  .mission-attr { font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; }

  /* ── Email Capture ── */
  .capture { background: ${NAVY}; }
  .capture-inner { max-width: 640px; margin: 0 auto; text-align: center; }
  .capture-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; color: ${WHITE}; margin-bottom: 16px; line-height: 1.15; }
  .capture-title em { font-style: italic; color: ${GOLD}; }
  .capture-sub { font-size: 17px; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 40px; }
  .capture-form { display: flex; flex-direction: column; gap: 12px; }
  .capture-row { display: flex; gap: 12px; }
  .capture-input { flex: 1; padding: 16px 18px; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 8px; color: ${WHITE}; font-family: inherit; font-size: 15px; outline: none; transition: border-color 0.2s; -webkit-appearance: none; }
  .capture-input::placeholder { color: rgba(255,255,255,0.35); }
  .capture-input:focus { border-color: ${GOLD}; }
  .capture-disclaimer { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.6; margin-top: 4px; }
  .capture-success { background: rgba(200,150,46,0.15); border: 1px solid rgba(200,150,46,0.3); border-radius: 12px; padding: 24px; text-align: center; }
  .capture-success-icon { font-size: 36px; margin-bottom: 12px; display: block; }
  .capture-success-text { font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.6; }
  .capture-success-text a { color: ${GOLD}; }

  /* ── Footer ── */
  .footer { background: ${DKNAVY}; padding: 56px 24px 32px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .footer-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${WHITE}; margin-bottom: 8px; }
  .footer-brand-tag { font-size: 12px; color: ${GOLD}; letter-spacing: 1px; margin-bottom: 16px; }
  .footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }
  .footer-col-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${SLATE}; margin-bottom: 16px; }
  .footer-links { display: flex; flex-direction: column; gap: 10px; }
  .footer-link { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.15s; }
  .footer-link:hover { color: ${WHITE}; }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }
  .footer-legal { display: flex; gap: 20px; }
  .footer-legal-link { font-size: 12px; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.15s; }
  .footer-legal-link:hover { color: rgba(255,255,255,0.6); }

  /* ── Legal Pages ── */
  .legal-hero { background: ${NAVY}; padding: 64px 24px 48px; text-align: center; }
  .legal-title { font-family: 'Playfair Display', serif; font-size: clamp(30px, 5vw, 52px); font-weight: 700; color: ${WHITE}; margin-bottom: 16px; line-height: 1.1; }
  .legal-date { font-size: 14px; color: ${SLATE}; }
  .legal-body { max-width: 760px; margin: 0 auto; padding: 64px 24px 80px; }
  .legal-toc { background: ${WHITE}; border-radius: 14px; padding: 28px 32px; margin-bottom: 48px; box-shadow: 0 2px 16px rgba(27,58,92,0.06); border-left: 4px solid ${GOLD}; }
  .legal-toc-title { font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; }
  .legal-toc-list { display: flex; flex-direction: column; gap: 8px; }
  .legal-toc-link { font-size: 14px; color: ${NAVY}; text-decoration: none; font-weight: 500; transition: color 0.15s; display: flex; align-items: center; gap: 8px; }
  .legal-toc-link::before { content: '§'; color: ${GOLD}; font-size: 12px; }
  .legal-toc-link:hover { color: ${GOLD}; }
  .legal-section { margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid #E8EDF2; }
  .legal-section:last-child { border-bottom: none; }
  .legal-section-num { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 10px; display: block; }
  .legal-section-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: ${NAVY}; margin-bottom: 16px; }
  .legal-p { font-size: 15px; line-height: 1.85; color: #555; margin-bottom: 16px; }
  .legal-p:last-child { margin-bottom: 0; }
  .legal-p strong { color: ${NAVY}; font-weight: 600; }
  .legal-p a { color: ${GOLD}; text-decoration: none; }
  .legal-list { margin: 12px 0 16px 20px; display: flex; flex-direction: column; gap: 8px; }
  .legal-list li { font-size: 15px; line-height: 1.7; color: #555; }
  .legal-callout { background: ${LTGOLD}; border-radius: 10px; padding: 20px 24px; border-left: 3px solid ${GOLD}; margin: 20px 0; font-size: 14px; line-height: 1.7; color: ${GRAY}; font-style: italic; }
  .legal-contact-box { background: ${NAVY}; border-radius: 14px; padding: 32px 36px; margin-top: 48px; }
  .legal-contact-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${WHITE}; margin-bottom: 12px; }
  .legal-contact-text { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 8px; }
  .legal-contact-link { color: ${GOLD}; text-decoration: none; font-weight: 600; }
  .legal-nav { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 48px; padding-top: 32px; border-top: 1px solid #E8EDF2; }
  .legal-nav-btn { padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; border: 2px solid; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
  .legal-nav-primary { background: ${NAVY}; color: ${WHITE}; border-color: ${NAVY}; }
  .legal-nav-primary:hover { background: #243f6a; }
  .legal-nav-outline { background: transparent; color: ${NAVY}; border-color: #D0D8E4; }
  .legal-nav-outline:hover { border-color: ${NAVY}; background: #F0F4F8; }
  .footer-mini { background: ${DKNAVY}; padding: 28px 48px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 3px solid ${GOLD}; }
  .footer-mini-copy { font-size: 12px; color: rgba(255,255,255,0.3); }
  .footer-mini-links { display: flex; gap: 20px; }
  .footer-mini-link { font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.15s; }
  .footer-mini-link:hover { color: rgba(255,255,255,0.7); }

  /* ── Reveal animation ── */
  .reveal { transition: opacity 0.7s ease, transform 0.7s ease; height: 100%; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .topbar { padding: 16px 24px; }
    .topbar-nav { display: none; }
    .featured-inner { grid-template-columns: 1fr; gap: 48px; }
    .about-inner { grid-template-columns: 1fr; gap: 40px; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
  }
  @media (max-width: 600px) {
    .section { padding: 72px 20px; }
    .hero { padding: 100px 20px 80px; }
    .capture-row { flex-direction: column; }
    .hero-actions { flex-direction: column; align-items: center; }
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
    .footer-mini { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
    .legal-body { padding: 40px 20px 60px; }
    .featured-dims { grid-template-columns: 1fr 1fr; }
  }
`;

// ── The Spine Shield — Mark I ──────────────────────────────────
function Shield({ size = 36, primary = WHITE, accent = GOLD, className = "" }) {
  const PATH = "M 50 3 C 50 3 12 16 7 19 L 7 52 C 7 76 30 91 50 97 C 70 91 93 76 93 52 L 93 19 C 88 16 50 3 50 3 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <path d={PATH} fill={primary}/>
      <line x1="50" y1="22" x2="50" y2="82" stroke={accent} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 50 14 L 44 26 L 50 22 L 56 26 Z" fill={accent}/>
      <line x1="36" y1="40" x2="64" y2="40" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      <line x1="40" y1="53" x2="60" y2="53" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
      <line x1="44" y1="66" x2="56" y2="66" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

// ── Scroll reveal hook ─────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="reveal" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transitionDelay: `${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Scroll-aware topbar ────────────────────────────────────────
function Topbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  return (
    <header className={`topbar ${solid ? "solid" : scrolled ? "scrolled" : ""}`}>
      <a href="#" className="topbar-logo" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}}>
        <Shield size={36} primary={WHITE} accent={GOLD}/>
        <div className="topbar-wordmark">
          <span className="topbar-brand">Est. 2024</span>
          <span className="topbar-name">LADD Academy</span>
        </div>
      </a>
      {solid ? (
        <Link to="/" className="topbar-back">← Back to Home</Link>
      ) : (
        <nav className="topbar-nav">
          <a href="#about"    className="topbar-link" onClick={e=>{e.preventDefault();document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}}>About</a>
          <a href="#programs" className="topbar-link" onClick={e=>{e.preventDefault();document.getElementById('programs')?.scrollIntoView({behavior:'smooth'})}}>Programs</a>
          <a href="#products" className="topbar-link" onClick={e=>{e.preventDefault();document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}}>Products</a>
          <a href="#contact"  className="topbar-link" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Contact</a>
          <a href="https://core-blueprint.laddacademy.com" className="topbar-cta" target="_blank" rel="noreferrer">
            Take the Assessment
          </a>
        </nav>
      )}
    </header>
  );
}

// ── Site Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">LADD Academy</div>
            <div className="footer-brand-tag">Building Leaders from the Inside Out</div>
            <p className="footer-brand-desc">
              A values-and-behaviors-based human development company serving individuals, coaches, and organizations through the CORE Blueprint™ framework and beyond. Veteran-owned.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Assessment</div>
            <div className="footer-links">
              <a href="https://core-blueprint.laddacademy.com" className="footer-link">Take Free Assessment</a>
              <a href="https://core-blueprint.laddacademy.com" className="footer-link">Full Blueprint — $24</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">CORE Blueprint™ 360</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Team Assessment</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Programs</div>
            <div className="footer-links">
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Executive Coaching</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Facilitator Certification</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Organizational Work</a>
              <a href="https://crucible-laddacademy.lovable.app" className="footer-link" target="_blank" rel="noreferrer">Crucible</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Resources</div>
            <div className="footer-links">
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">The Coaching Guide</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Books & Publications</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Speaking</a>
              <a href="#contact" onClick={(e)=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} className="footer-link">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 LADD Academy LLC. All Rights Reserved. Veteran-Owned Business.</span>
          <div className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
            <Link to="/disclaimer" className="footer-legal-link">Assessment Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────
function HomePage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function handleCapture(e) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setSubmitting(true);
    // Production: POST to Brevo
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  }

  return (
    <>
      <Topbar/>

      {/* Hero */}
      <section className="hero">
        <p className="hero-question">"Who are you when life presses in?"</p>
        <div className="hero-divider"/>
        <h1 className="hero-headline">Building Leaders<br/><em>from the Inside Out.</em></h1>
        <p className="hero-tagline">LADD Academy · Human Development</p>
        <p className="hero-sub">
          Values-based. Behaviorally grounded. Built for the people who want to lead their lives as well as they lead their work.
        </p>
        <div className="hero-actions">
          <a href="https://core-blueprint.laddacademy.com" className="btn-primary" target="_blank" rel="noreferrer">
            Take the Free Assessment →
          </a>
          <a href="#about" className="btn-outline-light" onClick={e=>{e.preventDefault();document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}}>Meet the Founder</a>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-text">Discover More</span>
          <div className="hero-scroll-line"/>
        </div>
      </section>

      {/* Mission */}
      <section className="mission section">
        <div className="mission-inner">
          <Reveal>
            <p className="mission-quote">
              "Most development stops at the office door. We believe the most important work happens from the inside out — in character, in relationships, and in who you become under pressure."
            </p>
            <span className="mission-attr">Founder, LADD Academy</span>
          </Reveal>
        </div>
      </section>

      {/* What We Do */}
      <section className="section" id="programs" style={{ background: CREAM }}>
        <div className="section-inner">
          <Reveal>
            <span className="section-eyebrow">What We Do</span>
            <h2 className="section-title">Human development<br/>for the <em>whole</em> life.</h2>
            <p className="section-body">
              LADD Academy serves individuals, leaders, coaches, and organizations through a values-and-behaviors framework that addresses the most important questions a person can ask — and gives them the tools to answer them.
            </p>
          </Reveal>
          <div className="what-grid">
            {[
              { icon:"🏛", title:"Individual Development", text:"The CORE Blueprint™ assessment reveals who you are at your best, what you most deeply need, and who you become under pressure — across every arena of your life.", link:"Take the Assessment →", href:"https://core-blueprint.laddacademy.com", external:true },
              { icon:"🧭", title:"Executive Coaching", text:"One-on-one coaching for leaders who want to close the gap between who they are and how they show up — in the boardroom, at home, and everywhere in between.", link:"Learn More →", href:"#contact", external:false },
              { icon:"📋", title:"Coach Training & Certification", text:"The CORE Blueprint™ Certified Facilitator program equips coaches, HR professionals, and L&D leaders with a behaviorally grounded tool and the training to use it.", link:"Join the Waitlist →", href:"#contact", external:false },
              { icon:"🏢", title:"Organizational Transformation", text:"Team assessments, leadership development programs, and organizational culture work grounded in the CORE Blueprint™ framework — for teams that want to perform and thrive.", link:"Explore →", href:"#contact", external:false },
              { icon:"📚", title:"Books & Resources", text:"Leadership fables, children's values books, and practitioner guides built on the same values-and-behaviors foundation. Tools for every stage of the development journey.", link:"Coming Soon →", href:"#products", external:false },
              { icon:"⚡", title:"Crucible", text:"AI-powered coaching development — where coaches are forged. Transcript evaluation, AI client practice, MCC demonstration coaching, and credential-level calibration.", link:"Enter Crucible →", href:"https://crucible-laddacademy.lovable.app", external:true },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="what-card">
                  <span className="what-icon">{card.icon}</span>
                  <div className="what-title">{card.title}</div>
                  <p className="what-text">{card.text}</p>
                  <a href={card.href} className="what-link" target={card.external ? "_blank" : undefined} rel={card.external ? "noreferrer" : undefined}>
                    {card.link} <span>›</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CORE Blueprint Featured */}
      <section className="featured section">
        <div className="featured-inner">
          <div>
            <Reveal>
              <span className="section-eyebrow" style={{ color: GOLD }}>Flagship Assessment</span>
              <h2 className="section-title" style={{ color: WHITE }}>The CORE<br/>Blueprint™</h2>
              <p className="section-body" style={{ color: "rgba(255,255,255,0.65)" }}>
                A behavioral assessment built around four dimensions that shape everything you do — at your best, under pressure, and in the relationships that matter most.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="featured-dims">
                {[
                  { l:"C", name:"Character", desc:"Who you are when no one is watching" },
                  { l:"O", name:"Orbit",     desc:"The world you create around you" },
                  { l:"R", name:"Roots",     desc:"What you need to grow" },
                  { l:"E", name:"Edge",      desc:"Who you become under pressure" },
                ].map(d => (
                  <div className="featured-dim" key={d.l}>
                    <div className="featured-dim-letter">{d.l}</div>
                    <div className="featured-dim-name">{d.name}</div>
                    <div className="featured-dim-desc">{d.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="featured-right">
            <Reveal delay={0.1}>
              <div className="featured-report-card">
                <div className="featured-report-tier">Free Report — Your CORE</div>
                <div className="featured-report-title">Discover Your Type</div>
                <ul className="featured-report-items">
                  {["Your CORE type name and identity","Your Reach — best-self behaviors","Your Roots — primary human need","How you serve others","A glimpse of your Edge"].map(i => (
                    <li className="featured-report-item" key={i}>{i}</li>
                  ))}
                </ul>
                <div className="featured-price">
                  <span className="featured-price-free">Free</span>
                  <span className="featured-price-note">— always</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="featured-report-card" style={{ borderColor:"rgba(200,150,46,0.3)", background:"rgba(200,150,46,0.06)" }}>
                <div className="featured-report-tier">Full Blueprint — Paid</div>
                <div className="featured-report-title">The Complete Picture</div>
                <ul className="featured-report-items">
                  {["Full Drift Profile + Impact Layer","The Perception Gap — intent vs. impact","Your Trigger Map","CORE Growth Guide — triggered practices","For Those Who Know You","Work, leadership & career alignment"].map(i => (
                    <li className="featured-report-item" key={i}>{i}</li>
                  ))}
                </ul>
                <div className="featured-price">
                  <span className="featured-price-paid">$24</span>
                  <span className="featured-price-note">— one time</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <a href="https://core-blueprint.laddacademy.com" className="btn-primary" style={{ width:"100%", justifyContent:"center" }} target="_blank" rel="noreferrer">
                Begin Your Free Assessment →
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about" style={{ background: WHITE }}>
        <div className="about-inner">
          {/* LEFT — all text content */}
          <Reveal>
            <div>
              <span className="section-eyebrow">About the Founder</span>
              <h2 className="section-title">Paul Ladd</h2>
              <p className="section-body" style={{ marginBottom: 24 }}>
                Over thirty years of working with people, I've seen what happens when the human side of leadership gets lost. I've watched the pain in someone's eyes when they stop believing their work matters. I've watched good people become smaller versions of themselves under leaders who never understood how their own needs, values, and behaviors affected the people around them.
              </p>
              <p className="about-quote">
                "I've also seen something else. I've seen what happens when people understand themselves, find their voice, reconnect with what matters to them, and begin leading from a place of authenticity. The difference can be extraordinary."
              </p>
              <p className="section-body" style={{ marginTop: 20, marginBottom: 24 }}>
                That is where LADD Academy began. The belief that people are capable of more. That leadership is deeply human. That lasting change begins with understanding the person looking back at you in the mirror.
              </p>
              <span className="about-quote-attr">Paul Ladd · Founder</span>
              <div style={{ marginTop:36, padding:"24px 28px", background:"#0F2035", borderRadius:14, borderLeft:"4px solid #C8962E" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#C8962E", marginBottom:12 }}>About the Framework</div>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.8, margin:0 }}>
                  The CORE Blueprint™ was built from the inside out — the same way it asks you to grow. It began with three decades of direct observation: watching leaders succeed and fail, watching people find their voice and lose it, watching the cost of self-ignorance and the transformation that follows self-knowledge. It was developed by a practitioner, grounded in behavioral science, and positioned honestly within its scope. It is a development tool. It makes no clinical claims. It does exactly what it says — it shows you who you are, what you need, who you become under pressure, and what growth looks like from there.
                </p>
              </div>
            </div>
          </Reveal>
          {/* RIGHT — credential cards + LADD Academy Serves */}
          <Reveal delay={0.15}>
            <div>
              <div className="about-credentials">
                {[
                  { icon:"🎖", title:"Military Veteran", text:"Three decades of service informing a deep understanding of leadership under pressure" },
                  { icon:"🏛", title:"Executive Coach", text:"One-on-one coaching for leaders across government, military, and private sector" },
                  { icon:"📖", title:"Author", text:"Multiple books on leadership, values, and human development" },
                  { icon:"🎓", title:"Coach Educator", text:"Founder of LADD Academy's coach training programs, anchored to ICF Core Competencies" },
                ].map((c, i) => (
                  <div className="about-cred" key={i}>
                    <span className="about-cred-icon">{c.icon}</span>
                    <div className="about-cred-text">
                      <strong>{c.title}</strong>
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24, padding:"24px 28px", background:CREAM, borderRadius:14, border:"1px solid #EEF2F7" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:SLATE, marginBottom:14 }}>LADD Academy Serves</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["Individuals","Executive Leaders","Coaches & Therapists","HR & L&D Professionals","Organizations","Faith Communities","Veterans"].map(t => (
                    <span key={t} style={{ background:LTBLUE, color:NAVY, borderRadius:20, padding:"5px 13px", fontSize:13, fontWeight:600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section className="section" id="products" style={{ background: CREAM }}>
        <div className="section-inner">
          <Reveal>
            <span className="section-eyebrow">Products & Resources</span>
            <h2 className="section-title">Everything in one <em>ecosystem.</em></h2>
            <p className="section-body">
              Every LADD Academy product is built on the same values-and-behaviors foundation. They work together — and every entry point feeds the same development journey.
            </p>
          </Reveal>
          <div className="products-grid">
            {[
              { status:"live",  label:"Live Now",    icon:"🏛", title:"CORE Blueprint™ Assessment", text:"The free behavioral assessment. Discover your type, your needs, and your Edge in 12–15 minutes.", action:"Take It Free →", href:"https://core-blueprint.laddacademy.com", external:true },
              { status:"live",  label:"Available",   icon:"🧭", title:"The Coaching Guide", text:"A practitioner's guide to working with CORE Blueprint™ results in one-on-one coaching engagements. Six parts, all 12 types.", action:"Purchase →", href:"#contact", external:false },
              { status:"soon",  label:"Coming Soon", icon:"📋", title:"Facilitator Certification", text:"Train to deploy the CORE Blueprint™ with individuals, teams, and organizations. Certified Facilitator program.", action:"Join Waitlist →", href:"#contact", external:false },
              { status:"soon",  label:"Coming Soon", icon:"🔄", title:"CORE Blueprint™ 360", text:"Multi-rater behavioral assessment across Inner Circle, Peer, Lead, and Authority circles. The only 360 that asks how you show up at home.", action:"Join Waitlist →", href:"#contact", external:false },
              { status:"dev",   label:"In Beta",     icon:"⚡", title:"Crucible", text:"Where coaches are forged. AI client practice, transcript evaluation, MCC demonstration coaching, and credential-level calibration.", action:"Enter Crucible →", href:"https://crucible-laddacademy.lovable.app", external:true },
              { status:"soon",  label:"Coming Soon", icon:"📚", title:"Books & Publications", text:"The CORE Blueprint™ book, Broken at Work, children's values books, and more. Built on the same inside-out philosophy.", action:"Notify Me →", href:"#contact", external:false },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="product-card">
                  <span className={`product-status status-${p.status}`}>{p.label}</span>
                  <div style={{ fontSize:28, marginBottom:12 }}>{p.icon}</div>
                  <div className="product-title">{p.title}</div>
                  <p className="product-text">{p.text}</p>
                  <a href={p.href} className="product-action" target={p.external ? "_blank" : undefined} rel={p.external ? "noreferrer" : undefined}>
                    {p.action} <span>›</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="capture section" id="contact">
        <div className="capture-inner">
          <Reveal>
            <span className="section-eyebrow" style={{ display:"block", marginBottom:16 }}>Stay Connected</span>
            <h2 className="capture-title">The inside-out journey<br/>starts with <em>one question.</em></h2>
            <p className="capture-sub">
              Join the LADD Academy community. Be the first to know about new programs, research, and resources.
            </p>
          </Reveal>
          {submitted ? (
            <Reveal>
              <div className="capture-success">
                <span className="capture-success-icon">🌱</span>
                <p className="capture-success-text">
                  <strong style={{ color:GOLD }}>You're in, {name.split(" ")[0]}.</strong><br/>
                  Watch your inbox for a welcome from LADD Academy. Haven't taken the assessment yet? <a href="https://core-blueprint.laddacademy.com">Start here.</a>
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.15}>
              <form className="capture-form" onSubmit={handleCapture}>
                <div className="capture-row">
                  <input className="capture-input" placeholder="First name" value={name} onChange={e => setName(e.target.value)} required/>
                  <input className="capture-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="btn-primary" style={{ width:"100%", justifyContent:"center" }} disabled={submitting}>
                  {submitting ? "Joining…" : "Join the Community →"}
                </button>
                <p className="capture-disclaimer">
                  No spam. No selling your information. Unsubscribe anytime. By joining you agree to LADD Academy's{" "}
                  <Link to="/privacy" style={{ color:GOLD }}>Privacy Policy</Link>.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <Footer/>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// LEGAL PAGE SHELL
// ─────────────────────────────────────────────────────────────
function LegalShell({ title, children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Topbar solid={true}/>
      <div className="legal-hero">
        <span className="section-eyebrow">Legal</span>
        <h1 className="legal-title">{title}</h1>
        <p className="legal-date">Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}</p>
      </div>
      {children}
      <footer className="footer-mini">
        <span className="footer-mini-copy">© 2026 LADD Academy LLC. All Rights Reserved.</span>
        <div className="footer-mini-links">
          <Link to="/privacy"    className="footer-mini-link">Privacy Policy</Link>
          <Link to="/terms"      className="footer-mini-link">Terms of Service</Link>
          <Link to="/disclaimer" className="footer-mini-link">Assessment Disclaimer</Link>
        </div>
      </footer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PRIVACY POLICY
// ─────────────────────────────────────────────────────────────
function PrivacyPolicy() {
  return (
    <LegalShell title="Privacy Policy">
      <div className="legal-body">
        <div className="legal-callout">
          Plain-language summary: LADD Academy LLC collects your name and email to deliver your assessment results and communicate with you about programs. We do not sell your data. We do not share it with third parties except the services needed to run our platform. You can request deletion at any time.
        </div>
        <div className="legal-toc">
          <div className="legal-toc-title">Contents</div>
          <div className="legal-toc-list">
            {["Who We Are","What Information We Collect","How We Use Your Information","How We Store and Protect Your Information","Who We Share Information With","Your Rights and Choices","Cookies and Tracking","Children's Privacy","International Users","Changes to This Policy","Contact Us"].map((item, i) => (
              <a key={i} href={`#pp-${i+1}`} className="legal-toc-link">{item}</a>
            ))}
          </div>
        </div>

        {[
          { id:"pp-1", num:"1", title:"Who We Are", content: <>
            <p className="legal-p">LADD Academy LLC is a values-and-behaviors-based human development company. We operate the CORE Blueprint™ assessment platform at <strong>core-blueprint.laddacademy.com</strong> and the LADD Academy website at <strong>laddacademy.com</strong> (collectively, "the Platform").</p>
            <p className="legal-p">LADD Academy LLC is a veteran-owned business. We are committed to handling personal information with the same integrity we bring to our development work — honestly, carefully, and with full respect for the people who trust us with it.</p>
            <p className="legal-p">For privacy-related questions, contact us at: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </>},
          { id:"pp-2", num:"2", title:"What Information We Collect", content: <>
            <p className="legal-p"><strong>Information you provide directly:</strong></p>
            <ul className="legal-list">
              <li><strong>Name and email address</strong> — collected when you begin the CORE Blueprint™ assessment or sign up to receive communications from LADD Academy LLC.</li>
              <li><strong>Assessment responses</strong> — your answers to the 72 assessment questions. These are used solely to generate your behavioral profile and report.</li>
              <li><strong>Payment information</strong> — processed by Stripe. LADD Academy LLC never sees or stores your card number or banking information.</li>
              <li><strong>Communications</strong> — if you contact us, we retain that correspondence to respond and improve our services.</li>
            </ul>
            <p className="legal-p" style={{ marginTop:16 }}><strong>Information collected automatically:</strong></p>
            <ul className="legal-list">
              <li><strong>Usage data</strong> — pages visited, completion rates. Collected in aggregate through Vercel analytics. Not linked to individual identities.</li>
              <li><strong>Device and browser information</strong> — used to ensure the platform displays correctly across devices.</li>
              <li><strong>IP address</strong> — collected by our hosting provider (Vercel) as part of standard web server operation. Not stored or used for profiling by LADD Academy LLC.</li>
            </ul>
          </>},
          { id:"pp-3", num:"3", title:"How We Use Your Information", content: <>
            <p className="legal-p">We use the information we collect to deliver your assessment results, communicate with you about programs and updates, improve our products through anonymized aggregate data, and provide customer support.</p>
            <div className="legal-callout">The CORE Blueprint™ assessment is a personal development tool. Your results are not used by LADD Academy LLC for any employment, hiring, or screening purpose — and you are expressly prohibited from using them for those purposes under our Terms of Service.</div>
          </>},
          { id:"pp-4", num:"4", title:"How We Store and Protect Your Information", content: <>
            <p className="legal-p">Your data is stored securely using Supabase, encrypted at rest and in transit. Access is governed by row-level security policies. All data transmitted between your browser and our platform is encrypted using TLS.</p>
            <p className="legal-p">In the unlikely event of a data breach affecting your personal information, we will notify you in accordance with applicable law.</p>
          </>},
          { id:"pp-5", num:"5", title:"Who We Share Information With", content: <>
            <p className="legal-p"><strong>We do not sell your personal information.</strong> We share data only with:</p>
            <ul className="legal-list">
              <li><strong>Service providers</strong> — Vercel (hosting), Supabase (database), Stripe (payments), and Brevo (email). Each receives only the data necessary to perform their function.</li>
              <li><strong>Your coach or facilitator</strong> — only with your explicit consent.</li>
              <li><strong>Legal requirements</strong> — if required by law or court order.</li>
            </ul>
          </>},
          { id:"pp-6", num:"6", title:"Your Rights and Choices", content: <>
            <p className="legal-p">You may request access, correction, deletion, or portability of your personal information at any time. You may also opt out of communications using the unsubscribe link in any email or by contacting us directly.</p>
            <p className="legal-p"><strong>California residents (CCPA):</strong> You have the right to know what personal information is collected, to request deletion, and to opt out of the sale of personal information. We do not sell personal information.</p>
            <p className="legal-p"><strong>European residents (GDPR):</strong> Our lawful basis for processing is contractual necessity and legitimate interest. You have the right to lodge a complaint with your local data protection authority.</p>
            <p className="legal-p">To exercise any right, contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
          </>},
          { id:"pp-7", num:"7", title:"Cookies and Tracking", content: <>
            <p className="legal-p">LADD Academy LLC uses minimal cookies required for the site to function. We do not use third-party advertising or behavioral tracking cookies. Vercel Analytics may collect anonymized usage data not linked to individual identities.</p>
          </>},
          { id:"pp-8", num:"8", title:"Children's Privacy", content: <>
            <p className="legal-p">The CORE Blueprint™ platform is not directed at children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </>},
          { id:"pp-9", num:"9", title:"International Users", content: <>
            <p className="legal-p">LADD Academy LLC is based in the United States. If you access the platform from outside the United States, your information will be transferred to and processed in the United States. We implement appropriate safeguards to protect your information regardless of where it is processed.</p>
          </>},
          { id:"pp-10", num:"10", title:"Changes to This Policy", content: <>
            <p className="legal-p">We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last Updated" date and, where appropriate, notify you by email.</p>
          </>},
          { id:"pp-11", num:"11", title:"Contact Us", content: <>
            <p className="legal-p">For privacy-related questions or requests:</p>
          </>},
        ].map(({ id, num, title, content }) => (
          <div className="legal-section" id={id} key={id}>
            <span className="legal-section-num">Section {num}</span>
            <h2 className="legal-section-title">{title}</h2>
            {content}
          </div>
        ))}

        <div className="legal-contact-box">
          <div className="legal-contact-title">Privacy Inquiries</div>
          <p className="legal-contact-text"><strong style={{ color:WHITE }}>LADD Academy LLC</strong></p>
          <p className="legal-contact-text">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="legal-contact-link">{CONTACT_EMAIL}</a></p>
          <p className="legal-contact-text">Website: <a href="https://laddacademy.com" className="legal-contact-link">laddacademy.com</a></p>
        </div>

        <div className="legal-nav">
          <Link to="/terms" className="legal-nav-btn legal-nav-primary">Terms of Service →</Link>
          <Link to="/" className="legal-nav-btn legal-nav-outline">← Return to Home</Link>
        </div>
      </div>
    </LegalShell>
  );
}

// ─────────────────────────────────────────────────────────────
// TERMS OF SERVICE
// ─────────────────────────────────────────────────────────────
function TermsOfService() {
  return (
    <LegalShell title="Terms of Service">
      <div className="legal-body">
        <div className="legal-callout">
          Plain-language summary: Use the CORE Blueprint™ for personal growth — not for hiring or clinical decisions. Pay for what you purchase. Don't reproduce or resell our content. We're not liable for how you choose to use your results.
        </div>
        <div className="legal-toc">
          <div className="legal-toc-title">Contents</div>
          <div className="legal-toc-list">
            {["Acceptance of Terms","Who May Use Our Services","The CORE Blueprint™ Assessment","Permitted and Prohibited Uses","Purchases and Payments","Intellectual Property","Facilitator and Coach Licenses","Disclaimer of Warranties","Limitation of Liability","Indemnification","Termination","Governing Law and Disputes","Changes to These Terms","Contact"].map((item, i) => (
              <a key={i} href={`#tos-${i+1}`} className="legal-toc-link">{item}</a>
            ))}
          </div>
        </div>

        {[
          { id:"tos-1", num:"1", title:"Acceptance of Terms", body:"By accessing or using any LADD Academy LLC platform — including the CORE Blueprint™ assessment at core-blueprint.laddacademy.com, the LADD Academy website at laddacademy.com, or any associated products or services — you agree to be bound by these Terms of Service and our Privacy Policy." },
          { id:"tos-2", num:"2", title:"Who May Use Our Services", body:"You may use LADD Academy LLC services if you are at least 13 years of age (users 13–17 require parental consent), have the legal capacity to enter into a binding agreement, are not prohibited from using our services under applicable law, and provide accurate information when completing the assessment." },
          { id:"tos-3", num:"3", title:"The CORE Blueprint™ Assessment", body:null, extra: <>
            <p className="legal-p">The CORE Blueprint™ is a <strong>self-report behavioral development tool</strong> designed for personal growth, professional development, coaching, and organizational learning. It is not a clinical assessment, psychological diagnostic instrument, or medical tool of any kind.</p>
            <div className="legal-callout">The CORE Blueprint™ is NOT designed or validated for use in employee selection, hiring, promotion, compensation decisions, performance evaluation, or termination. Using assessment results for employment decisions may expose you to significant legal liability and is expressly prohibited by these Terms.</div>
          </>},
          { id:"tos-4", num:"4", title:"Permitted and Prohibited Uses", body:null, extra: <>
            <p className="legal-p"><strong>You may:</strong> complete the assessment for personal development, share your report with a coach, use results in personal coaching sessions, and purchase licensed materials under the terms provided.</p>
            <p className="legal-p"><strong>You may not:</strong> use assessment results for employment decisions, reproduce or resell any assessment content or framework materials, reverse engineer the scoring algorithm, or create derivative assessments based on the CORE Blueprint™ framework without written permission.</p>
          </>},
          { id:"tos-5", num:"5", title:"Purchases and Payments", body:"Paid products are processed through Stripe. All sales are final. Digital products are delivered immediately upon payment and are not eligible for refund once accessed. Contact support@laddacademy.com within 7 days if you experience a technical problem preventing access." },
          { id:"tos-6", num:"6", title:"Intellectual Property", body:null, extra: <>
            <p className="legal-p">All content — including the CORE Blueprint™ framework, C·O·R·E dimensions, Roots & Reach framework, the 12 CORE Type profiles, CORE Growth Index™, all report language, assessment questions, scoring methodology, the Coaching Guide, the Debrief Guide, and all visual design elements — is the exclusive intellectual property of LADD Academy LLC and is protected by United States copyright law.</p>
            <p className="legal-p"><strong>CORE Blueprint™</strong>, <strong>LADD Academy™</strong>, and <strong>Crucible™</strong> are trademarks of LADD Academy LLC. Your personal assessment results belong to you for personal use.</p>
          </>},
          { id:"tos-7", num:"7", title:"Facilitator and Coach Licenses", body:"Coaches, facilitators, and organizations that purchase seat packs, the Coaching Guide, the Debrief Guide, or a Facilitator Certification receive a limited, non-exclusive, non-transferable license to use CORE Blueprint™ materials with their clients. Facilitators may not reproduce, resell, or create derivative works. Licensed materials may not be used for employment decisions." },
          { id:"tos-8", num:"8", title:"Disclaimer of Warranties", body:"THE CORE BLUEPRINT™ PLATFORM AND ALL ASSOCIATED PRODUCTS ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTY OF ANY KIND. The CORE Blueprint™ is a self-development tool, not a clinical or psychological service." },
          { id:"tos-9", num:"9", title:"Limitation of Liability", body:"TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LADD ACADEMY LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. LADD Academy LLC's total liability for any claim shall not exceed the amount you paid in the twelve months preceding the claim, or $50, whichever is greater." },
          { id:"tos-10", num:"10", title:"Indemnification", body:"You agree to defend, indemnify, and hold harmless LADD Academy LLC from any claims arising from your violation of these Terms, including any use of assessment results for employment decisions." },
          { id:"tos-11", num:"11", title:"Termination", body:"LADD Academy LLC reserves the right to suspend or terminate your access for violation of these Terms. To request deletion of your account and associated data, contact us at privacy@laddacademy.com." },
          { id:"tos-12", num:"12", title:"Governing Law and Disputes", body:"These Terms are governed by the laws of the United States and the state in which LADD Academy LLC is incorporated. Disputes shall first be addressed through good-faith negotiation, then binding arbitration under the American Arbitration Association's Consumer Arbitration Rules." },
          { id:"tos-13", num:"13", title:"Changes to These Terms", body:"LADD Academy LLC reserves the right to modify these Terms at any time. Material changes will be communicated by updating the 'Last Updated' date and, where appropriate, by email notification." },
          { id:"tos-14", num:"14", title:"Contact", body:"Questions about these Terms should be directed to legal@laddacademy.com." },
        ].map(({ id, num, title, body, extra }) => (
          <div className="legal-section" id={id} key={id}>
            <span className="legal-section-num">Section {num}</span>
            <h2 className="legal-section-title">{title}</h2>
            {body && <p className="legal-p">{body}</p>}
            {extra}
          </div>
        ))}

        <div className="legal-contact-box">
          <div className="legal-contact-title">Legal Inquiries</div>
          <p className="legal-contact-text"><strong style={{ color:WHITE }}>LADD Academy LLC</strong></p>
          <p className="legal-contact-text">Email: <a href="mailto:legal@laddacademy.com" className="legal-contact-link">legal@laddacademy.com</a></p>
        </div>

        <div className="legal-nav">
          <Link to="/privacy" className="legal-nav-btn legal-nav-primary">Privacy Policy →</Link>
          <Link to="/" className="legal-nav-btn legal-nav-outline">← Return to Home</Link>
        </div>
      </div>
    </LegalShell>
  );
}

// ─────────────────────────────────────────────────────────────
// ASSESSMENT DISCLAIMER
// ─────────────────────────────────────────────────────────────
function AssessmentDisclaimer() {
  return (
    <LegalShell title="Assessment Disclaimer">
      <div className="legal-body">
        {[
          { id:"ad-1", num:"1", title:"Nature of the Assessment", body:"The CORE Blueprint™ is a self-report behavioral development tool designed exclusively for personal growth, professional development, leadership coaching, and organizational learning. It is not a clinical assessment, psychological diagnostic instrument, or medical tool of any kind. Results reflect behavioral tendencies — not fixed personality traits, clinical diagnoses, or objective measurements of ability or character." },
          { id:"ad-2", num:"2", title:"Not for Employment Decisions", body:"The CORE Blueprint™ has not been validated for use in employee selection, hiring, promotion, compensation decisions, performance evaluation, or termination. Using this assessment for any employment-related decision may expose you to significant legal liability under Title VII of the Civil Rights Act, the Americans with Disabilities Act, and other applicable federal and state employment laws. Such use is expressly prohibited by LADD Academy LLC's Terms of Service." },
          { id:"ad-3", num:"3", title:"Not a Substitute for Professional Services", body:"Assessment results are intended as a starting point for personal reflection and growth — not a replacement for professional mental health services, medical advice, legal counsel, or financial guidance. If you are experiencing mental health concerns, please consult a qualified mental health professional." },
          { id:"ad-4", num:"4", title:"Self-Report Limitations", body:"Because the CORE Blueprint™ relies on self-reported responses, results may be influenced by your level of self-awareness, your willingness to answer honestly, and contextual factors in your life at the time of completion. Some variation between assessments taken at different times is normal and expected." },
          { id:"ad-5", num:"5", title:"Validation Status", body:"The CORE Blueprint™ framework has been developed through rigorous content design grounded in behavioral science and human development research. Formal psychometric validation studies are ongoing. Current use is recommended for personal and professional development purposes, ideally in conjunction with qualified coaching or facilitation." },
          { id:"ad-6", num:"6", title:"No Affiliation", body:"The CORE Blueprint™ is an original behavioral assessment developed independently by LADD Academy LLC. It is not affiliated with, derived from, endorsed by, or associated with Gallup®, The Myers-Briggs Company®, Wiley®, or any other assessment publisher. CliftonStrengths®, MBTI®, and DiSC® are property of their respective owners." },
        ].map(({ id, num, title, body }) => (
          <div className="legal-section" id={id} key={id}>
            <span className="legal-section-num">Section {num}</span>
            <h2 className="legal-section-title">{title}</h2>
            <p className="legal-p">{body}</p>
          </div>
        ))}

        <div className="legal-nav">
          <Link to="/privacy" className="legal-nav-btn legal-nav-primary">Privacy Policy →</Link>
          <Link to="/terms"   className="legal-nav-btn legal-nav-outline">Terms of Service →</Link>
          <Link to="/"        className="legal-nav-btn legal-nav-outline">← Return to Home</Link>
        </div>
      </div>
    </LegalShell>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{sharedCSS}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<HomePage/>}/>
          <Route path="/privacy"    element={<PrivacyPolicy/>}/>
          <Route path="/terms"      element={<TermsOfService/>}/>
          <Route path="/disclaimer" element={<AssessmentDisclaimer/>}/>
          <Route path="*"           element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
