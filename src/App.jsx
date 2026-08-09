import { useState, useEffect, useRef } from 'react';
import {
  likertQuestions, forcedChoiceQuestions, scenarioQuestions,
  scoreAssessment, CORE_TYPES, DIMENSIONS, TOTAL_QUESTIONS
} from './data.js';
import { GROWTH_CONTENT } from './growth.js';

  likertQuestions, forcedChoiceQuestions, scenarioQuestions,
  scoreAssessment, CORE_TYPES, DIMENSIONS, TOTAL_QUESTIONS

// ─── Styles ───────────────────────────────────────────────────
const NAVY  = "#1B3A5C";
const GOLD  = "#C8962E";
const CREAM = "#FAFAFA";
const GRAY  = "#444444";
const LTBLUE= "#D6E4F0";
const LTGOLD= "#FDF3E0";
const LTGRAY= "#F5F5F5";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: ${CREAM};
    color: ${GRAY};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .topbar {
    background: ${NAVY};
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    border-bottom: 3px solid ${GOLD};
  }
  .topbar-logo { display: flex; flex-direction: column; gap: 1px; }
  .topbar-brand { font-size: 11px; font-weight: 600; letter-spacing: 2px; color: rgba(255,255,255,0.6); text-transform: uppercase; }
  .topbar-title { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
  .topbar-title span { color: ${GOLD}; }
  .topbar-right { font-size: 12px; color: rgba(255,255,255,0.5); }

  .page { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 60px 24px; }
  .page-narrow { max-width: 720px; width: 100%; }
  .page-wide   { max-width: 1100px; width: 100%; }

  /* ── Landing ── */
  .landing-hero { text-align: center; padding: 80px 0 60px; }
  .landing-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; color: ${GOLD};
    margin-bottom: 20px;
  }
  .landing-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(38px, 6vw, 64px);
    font-weight: 700;
    color: ${NAVY};
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .landing-headline em { font-style: italic; color: ${GOLD}; }
  .landing-sub {
    font-size: 18px; line-height: 1.7; color: #666;
    max-width: 560px; margin: 0 auto 48px;
  }

  .dims-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 16px; margin: 48px 0;
  }
  .dim-card {
    background: #fff;
    border: 1.5px solid #E8EDF2;
    border-radius: 12px;
    padding: 24px;
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .dim-card:hover { border-color: ${GOLD}; box-shadow: 0 4px 20px rgba(27,58,92,0.08); }
  .dim-letter {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700;
    color: ${NAVY}; margin-bottom: 4px;
  }
  .dim-name { font-size: 13px; font-weight: 600; color: ${GOLD}; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .dim-desc { font-size: 14px; color: #666; line-height: 1.5; }

  .details-row {
    display: flex; gap: 32px; justify-content: center;
    margin: 40px 0; flex-wrap: wrap;
  }
  .detail-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; }
  .detail-icon { font-size: 18px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: inherit;
    font-weight: 600; letter-spacing: 0.3px;
    transition: all 0.18s; text-decoration: none;
  }
  .btn-primary {
    background: ${NAVY}; color: #fff;
    padding: 16px 40px; border-radius: 8px;
    font-size: 15px;
    box-shadow: 0 4px 20px rgba(27,58,92,0.25);
  }
  .btn-primary:hover { background: #243f6a; box-shadow: 0 6px 28px rgba(27,58,92,0.35); transform: translateY(-1px); }
  .btn-gold {
    background: ${GOLD}; color: #fff;
    padding: 18px 48px; border-radius: 8px;
    font-size: 16px;
    box-shadow: 0 4px 20px rgba(200,150,46,0.35);
  }
  .btn-gold:hover { background: #b8851e; box-shadow: 0 6px 28px rgba(200,150,46,0.45); transform: translateY(-1px); }
  .btn-outline {
    background: transparent; color: ${NAVY};
    border: 2px solid ${NAVY};
    padding: 12px 28px; border-radius: 8px;
    font-size: 14px;
  }
  .btn-outline:hover { background: ${NAVY}; color: #fff; }
  .btn-sm { padding: 10px 22px; font-size: 13px; border-radius: 6px; }

  /* ── Email Gate ── */
  .gate-card {
    background: #fff;
    border-radius: 16px;
    padding: 56px 48px;
    box-shadow: 0 8px 40px rgba(27,58,92,0.10);
    text-align: center;
    max-width: 520px;
    margin: 0 auto;
  }
  .gate-icon { font-size: 48px; margin-bottom: 16px; }
  .gate-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700;
    color: ${NAVY}; margin-bottom: 12px;
  }
  .gate-sub { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  .gate-form { display: flex; flex-direction: column; gap: 14px; }
  .gate-input-row { display: flex; gap: 10px; }
  .gate-input {
    flex: 1; padding: 14px 16px;
    border: 1.5px solid #ddd; border-radius: 8px;
    font-family: inherit; font-size: 14px; color: ${GRAY};
    outline: none; transition: border-color 0.2s;
  }
  .gate-input:focus { border-color: ${NAVY}; }
  .gate-disclaimer { font-size: 11px; color: #999; line-height: 1.5; }

  /* ── Progress Arc ── */
  .progress-header {
    background: #fff;
    border-bottom: 1px solid #E8EDF2;
    padding: 20px 32px;
    display: flex; align-items: center; gap: 24px;
    position: sticky; top: 67px; z-index: 90;
  }
  .progress-arc-wrap { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
  .progress-arc-wrap svg { transform: rotate(-90deg); }
  .progress-arc-text {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: ${NAVY};
  }
  .progress-meta { flex: 1; }
  .progress-layer { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 2px; }
  .progress-label { font-size: 14px; font-weight: 500; color: ${NAVY}; }
  .progress-bar-wrap { width: 100%; height: 4px; background: #E8EDF2; border-radius: 2px; margin-top: 6px; }
  .progress-bar-fill { height: 100%; background: ${GOLD}; border-radius: 2px; transition: width 0.4s ease; }

  /* ── Question Card ── */
  .q-wrap { padding: 40px 0; }
  .q-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px 40px 32px;
    box-shadow: 0 4px 24px rgba(27,58,92,0.07);
    margin-bottom: 24px;
  }
  .q-type-badge {
    display: inline-block;
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase;
    background: ${LTBLUE}; color: ${NAVY};
    padding: 4px 12px; border-radius: 20px;
    margin-bottom: 20px;
  }
  .q-text {
    font-size: 19px; font-weight: 500; color: ${NAVY};
    line-height: 1.55; margin-bottom: 32px;
  }

  /* Likert options */
  .likert-options {
    display: flex; gap: 8px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .likert-labels { display: flex; justify-content: space-between; margin-top: 10px; }
  .likert-label { font-size: 11px; color: #999; }
  .likert-btn {
    flex: 1; min-width: 44px; height: 52px;
    border: 2px solid #E0E6EE;
    border-radius: 10px;
    background: #fff; cursor: pointer;
    font-size: 15px; font-weight: 600; color: #888;
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
    -webkit-appearance: none; appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .likert-btn:hover { border-color: ${NAVY}; color: ${NAVY}; background: #F0F4F8; }
  .likert-btn.selected { border-color: ${NAVY}; background: ${NAVY}; color: #fff; }

  /* Forced choice */
  .fc-options { display: flex; flex-direction: column; gap: 12px; }
  .fc-btn {
    width: 100%; padding: 18px 22px;
    border: 2px solid #E0E6EE;
    border-radius: 12px; background: #fff;
    cursor: pointer; font-family: inherit;
    font-size: 15px; line-height: 1.5; color: ${GRAY};
    text-align: left; transition: all 0.15s;
    -webkit-appearance: none; appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .fc-btn:hover { border-color: ${NAVY}; background: #F8FAFC; color: ${NAVY}; }
  .fc-btn.selected { border-color: ${NAVY}; background: ${NAVY}; color: #fff; }
  .fc-divider { text-align: center; font-size: 12px; font-weight: 600; color: #BBB; letter-spacing: 1px; }

  /* Scenario */
  .scenario-text {
    font-size: 16px; color: #555; line-height: 1.6;
    background: ${LTGRAY}; border-radius: 10px;
    padding: 20px 24px; margin-bottom: 24px;
    border-left: 3px solid ${GOLD};
  }
  .sc-options { display: flex; flex-direction: column; gap: 10px; }
  .sc-btn {
    width: 100%; padding: 16px 20px;
    border: 2px solid #E0E6EE;
    border-radius: 10px; background: #fff;
    cursor: pointer; font-family: inherit;
    font-size: 14px; line-height: 1.5; color: ${GRAY};
    text-align: left; transition: all 0.15s;
    display: flex; align-items: flex-start; gap: 12px;
    -webkit-appearance: none; appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .sc-btn:hover { border-color: ${NAVY}; background: #F8FAFC; }
  .sc-btn.selected { border-color: ${NAVY}; background: ${NAVY}; color: #fff; }
  .sc-letter {
    flex-shrink: 0;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: #E8EDF2; color: ${NAVY};
    font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .sc-btn.selected .sc-letter { background: rgba(255,255,255,0.25); color: #fff; }

  /* Nav */
  .q-nav { display: flex; justify-content: space-between; align-items: center; }
  .q-counter { font-size: 13px; color: #999; }

  /* ── FREE REPORT ── */
  .report-wrap { width: 100%; max-width: 1060px; }

  /* Two-column desktop layout for reports */
  @media (min-width: 900px) {
    .report-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 32px;
      align-items: start;
    }
    .report-sidebar {
      position: sticky;
      top: 100px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .report-main { min-width: 0; }
  }
  @media (max-width: 899px) {
    .report-layout { display: block; }
    .report-sidebar { margin-bottom: 24px; }
  }

  .report-hero {
    background: ${NAVY};
    border-radius: 20px;
    padding: 56px 48px;
    margin-bottom: 32px;
    position: relative; overflow: hidden;
  }
  .report-hero::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(200,150,46,0.12);
  }
  .report-hero::after {
    content: '';
    position: absolute; bottom: -40px; left: 40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .report-greeting { font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 12px; }
  .report-type-emoji { font-size: 52px; margin-bottom: 12px; display: block; }
  .report-type-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700; color: #fff;
    line-height: 1.1; margin-bottom: 10px;
  }
  .report-tagline {
    font-size: 18px; font-style: italic;
    color: ${GOLD}; margin-bottom: 20px;
  }
  .report-family-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 20px; padding: 6px 16px;
    font-size: 12px; font-weight: 600;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.5px;
  }

  .report-section {
    background: #fff;
    border-radius: 16px;
    padding: 36px 40px;
    margin-bottom: 24px;
    box-shadow: 0 2px 16px rgba(27,58,92,0.06);
  }
  .section-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: ${GOLD};
    margin-bottom: 10px;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: ${NAVY}; margin-bottom: 16px;
  }
  .section-body { font-size: 15px; line-height: 1.7; color: #555; }

  /* Dimension bars */
  .dim-bars { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
  .dim-bar-row { display: flex; flex-direction: column; gap: 4px; }
  .dim-bar-label { display: flex; justify-content: space-between; }
  .dim-bar-name { font-size: 13px; font-weight: 600; color: ${NAVY}; }
  .dim-bar-desc { font-size: 12px; color: #888; }
  .dim-bar-score { font-size: 13px; font-weight: 700; color: ${GOLD}; }
  .dim-bar-track { height: 8px; background: #E8EDF2; border-radius: 4px; overflow: hidden; }
  .dim-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

  /* Values chips */
  .values-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .value-chip {
    background: ${NAVY}; color: #fff;
    border-radius: 20px; padding: 6px 16px;
    font-size: 13px; font-weight: 500;
  }

  /* Reach list */
  .reach-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
  .reach-item { display: flex; align-items: flex-start; gap: 12px; }
  .reach-icon { color: ${GOLD}; font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .reach-text { font-size: 15px; line-height: 1.5; color: #555; }

  /* Needs block */
  .need-block {
    background: ${LTGOLD};
    border-radius: 12px; padding: 24px 28px;
    border-left: 4px solid ${GOLD};
  }
  .need-name { font-size: 22px; font-weight: 700; color: ${NAVY}; margin-bottom: 6px; }
  .need-desc { font-size: 15px; color: #666; line-height: 1.6; }

  /* Serves others */
  .serves-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 18px; line-height: 1.6;
    color: ${NAVY}; margin-bottom: 0;
  }

  /* Drift tease */
  .drift-tease-card {
    background: linear-gradient(135deg, #1B3A5C 0%, #243f6a 100%);
    border-radius: 16px; padding: 36px 40px;
    margin-bottom: 24px;
  }
  .drift-tease-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 12px; }
  .drift-tease-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 700; margin-bottom: 16px; }
  .drift-tease-text { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); font-style: italic; margin-bottom: 24px; }

  /* Upgrade CTA */
  .upgrade-card {
    background: ${NAVY};
    border-radius: 20px; padding: 48px 48px;
    text-align: center; margin-bottom: 32px;
    border: 2px solid rgba(200,150,46,0.3);
  }
  .upgrade-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; }
  .upgrade-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.2; }
  .upgrade-sub { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }
  .upgrade-bullets { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto; }
  .upgrade-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.5; }
  .upgrade-bullet-icon { color: ${GOLD}; flex-shrink: 0; margin-top: 2px; }
  .upgrade-price { display: flex; align-items: baseline; justify-content: center; gap: 4px; margin-bottom: 8px; }
  .upgrade-price-amount { font-size: 42px; font-weight: 700; color: #fff; }
  .upgrade-price-period { font-size: 16px; color: rgba(255,255,255,0.5); }
  .upgrade-price-note { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 28px; }

  /* ── PAID REPORT ── */
  .paid-section-divider {
    background: ${NAVY};
    border-radius: 12px; padding: 20px 32px;
    margin: 32px 0 16px;
    display: flex; align-items: center; gap: 16px;
  }
  .paid-section-icon { font-size: 24px; }
  .paid-section-title { font-size: 16px; font-weight: 700; color: #fff; }
  .paid-section-sub { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 2px; }

  .drift-card {
    border: 2px solid #F0E0D0;
    border-radius: 12px; padding: 22px 24px;
    margin-bottom: 12px; background: #FFFAF7;
  }
  .drift-card-title { font-size: 15px; font-weight: 600; color: ${NAVY}; margin-bottom: 6px; }
  .drift-card-text { font-size: 14px; color: #666; line-height: 1.6; }

  .trigger-list { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .trigger-item { display: flex; align-items: flex-start; gap: 12px; background: #FFF8F0; border-radius: 10px; padding: 14px 16px; }
  .trigger-icon { font-size: 16px; flex-shrink: 0; }
  .trigger-text { font-size: 14px; line-height: 1.5; color: #555; }

  .growth-cards { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
  .growth-card {
    background: linear-gradient(135deg, #F0F7F4 0%, #E8F5F0 100%);
    border-radius: 12px; padding: 22px 24px;
    border-left: 4px solid #2E7D6E;
  }
  .growth-num { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #2E7D6E; margin-bottom: 6px; }
  .growth-text { font-size: 15px; color: #333; line-height: 1.6; }

  /* ── Paywall overlay ── */
  .paywall-overlay {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
  }
  .paywall-blur {
    filter: blur(4px);
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
  }
  .paywall-cta-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: rgba(27,58,92,0.85);
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }
  .paywall-cta-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; margin-bottom: 8px; }
  .paywall-cta-sub { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 24px; line-height: 1.5; }

  /* ── Disclaimer ── */
  .disclaimer { font-size: 11px; color: #AAA; line-height: 1.6; text-align: center; padding: 24px; max-width: 600px; margin: 0 auto; }

  /* Print / Save buttons */
  .report-actions {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .btn-print {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 8px;
    border: 2px solid #E0E6EE;
    background: #fff; cursor: pointer;
    font-family: inherit; font-size: 13px; font-weight: 600;
    color: ${NAVY}; transition: all 0.15s;
  }
  .btn-print:hover { border-color: ${NAVY}; background: ${NAVY}; color: #fff; }
  .btn-print-gold {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 8px;
    border: 2px solid ${GOLD};
    background: ${GOLD}; cursor: pointer;
    font-family: inherit; font-size: 13px; font-weight: 600;
    color: #fff; transition: all 0.15s;
  }
  .btn-print-gold:hover { background: #b8851e; border-color: #b8851e; }

  /* Sidebar identity card */
  .sidebar-identity {
    background: ${NAVY};
    border-radius: 16px; padding: 28px 24px;
    text-align: center;
  }
  .sidebar-emoji { font-size: 40px; margin-bottom: 8px; display: block; }
  .sidebar-type-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #fff; margin-bottom: 6px; line-height: 1.2;
  }
  .sidebar-tagline { font-size: 13px; font-style: italic; color: ${GOLD}; margin-bottom: 12px; }
  .sidebar-family {
    font-size: 11px; font-weight: 600; letter-spacing: 1px;
    color: rgba(255,255,255,0.5); text-transform: uppercase;
  }
  .sidebar-dim-bars { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
  .sidebar-dim-row { display: flex; flex-direction: column; gap: 3px; }
  .sidebar-dim-label { display: flex; justify-content: space-between; font-size: 11px; }
  .sidebar-dim-name { color: rgba(255,255,255,0.7); font-weight: 600; }
  .sidebar-dim-score { color: ${GOLD}; font-weight: 700; }
  .sidebar-dim-track { height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
  .sidebar-dim-fill { height: 100%; border-radius: 3px; }

  .sidebar-nav {
    background: #fff; border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 2px 12px rgba(27,58,92,0.06);
  }
  .sidebar-nav-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 12px; }
  .sidebar-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; font-size: 13px; color: #666;
    border-bottom: 1px solid #F0F2F5; cursor: pointer;
    transition: color 0.15s; text-decoration: none;
  }
  .sidebar-nav-item:last-child { border-bottom: none; }
  .sidebar-nav-item:hover { color: ${NAVY}; }
  .sidebar-nav-icon { font-size: 14px; width: 20px; text-align: center; }

  /* Free report teaser in paid view */
  .free-summary-card {
    background: ${LTGRAY};
    border-radius: 16px; padding: 28px 32px;
    margin-bottom: 24px;
    border: 1px solid #E8EDF2;
  }
  .free-summary-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin-bottom: 12px; }

  /* For Those Who Know You */
  .ftyky-card {
    background: linear-gradient(135deg, #1B3A5C 0%, #0F2035 100%);
    border-radius: 20px; padding: 44px 44px;
    margin-bottom: 24px;
  }
  .ftyky-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 12px; }
  .ftyky-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    color: #fff; margin-bottom: 20px; line-height: 1.2;
  }
  .ftyky-opening { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.75); margin-bottom: 28px; font-style: italic; }
  .ftyky-section-title { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 12px; margin-top: 24px; }
  .ftyky-body { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.8); margin-bottom: 16px; }
  .ftyky-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
  .ftyky-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.6; }
  .ftyky-bullet { color: ${GOLD}; flex-shrink: 0; margin-top: 3px; }
  .ftyky-never {
    background: rgba(200,150,46,0.12);
    border-left: 3px solid ${GOLD};
    border-radius: 8px; padding: 16px 20px;
    margin: 20px 0;
  }
  .ftyky-never-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 8px; }
  .ftyky-never-text { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.6; }
  .ftyky-closing { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.7); font-style: italic; }

  /* Impact layer */
  .impact-card {
    background: #fff;
    border-radius: 14px; padding: 28px 32px;
    margin-bottom: 20px;
    border: 1px solid #F0E8E0;
    box-shadow: 0 2px 12px rgba(27,58,92,0.05);
  }
  .impact-drift-name { font-size: 16px; font-weight: 700; color: ${NAVY}; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid ${LTGOLD}; }
  .impact-block { margin-bottom: 20px; }
  .impact-block-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin-bottom: 8px; }
  .impact-block-text { font-size: 14px; line-height: 1.75; color: #555; }
  .impact-invitation {
    background: ${LTGOLD};
    border-radius: 10px; padding: 16px 20px;
    border-left: 3px solid ${GOLD};
    font-size: 14px; line-height: 1.7; color: #555;
    font-style: italic;
  }
  .impact-invitation-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 8px; font-style: normal; }

  /* Perception gap */
  .perception-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .perception-table th {
    background: ${NAVY}; color: #fff;
    font-size: 12px; font-weight: 700; letter-spacing: 1px;
    padding: 12px 16px; text-align: left;
  }
  .perception-table th:first-child { border-radius: 8px 0 0 0; }
  .perception-table th:last-child { border-radius: 0 8px 0 0; }
  .perception-table td {
    padding: 14px 16px; font-size: 14px;
    line-height: 1.6; vertical-align: top;
    border-bottom: 1px solid #F0F2F5;
  }
  .perception-table tr:nth-child(odd) td { background: #FAFAFA; }
  .perception-table tr:nth-child(even) td { background: #fff; }
  .perception-table td:first-child { color: ${NAVY}; font-weight: 500; border-right: 2px solid #E8EDF2; font-style: italic; }
  .perception-table td:last-child { color: #666; }

  /* Growth guide triggered practices */
  .practice-card {
    background: #fff;
    border-radius: 16px; padding: 32px 36px;
    margin-bottom: 20px;
    box-shadow: 0 2px 16px rgba(27,58,92,0.06);
    border-left: 4px solid ${GOLD};
  }
  .practice-edge-title { font-size: 17px; font-weight: 700; color: ${NAVY}; margin-bottom: 24px; line-height: 1.3; }
  .practice-block { margin-bottom: 18px; }
  .practice-block-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: ${GOLD};
    margin-bottom: 8px;
  }
  .practice-block-text { font-size: 14px; line-height: 1.75; color: #555; }
  .practice-signal {
    background: linear-gradient(135deg, #F0F7F4 0%, #E8F5F0 100%);
    border-radius: 10px; padding: 14px 18px;
    border-left: 3px solid #2E7D6E;
    font-size: 13px; line-height: 1.6; color: #444;
    font-style: italic; margin-top: 8px;
  }
  .practice-signal-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #2E7D6E; margin-bottom: 6px; font-style: normal; display: block; }

  @media print {
    .topbar, .progress-header, .report-actions,
    .upgrade-card, .drift-tease-card,
    .sidebar-nav, .btn, .btn-print, .btn-print-gold { display: none !important; }
    .report-layout { display: block !important; }
    .report-sidebar { position: static !important; }
    .page { padding: 0 !important; }
    body { background: white !important; }
    .report-hero { border-radius: 0 !important; }
    .report-section { box-shadow: none !important; border: 1px solid #E8EDF2 !important; }
    .ftyky-card { break-before: page; }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .page { padding: 32px 16px; }
    .report-hero { padding: 36px 24px; }
    .report-section { padding: 24px 20px; }
    .q-card { padding: 28px 20px 24px; }
    .gate-card { padding: 36px 24px; }
    .dims-grid { grid-template-columns: 1fr; }
    .upgrade-card { padding: 32px 24px; }
    .progress-header { padding: 14px 16px; }
    .gate-input-row { flex-direction: column; }
    .likert-options { gap: 5px; }
    .topbar { padding: 12px 16px; }
  }
`;

// ─── Arc Progress Component ────────────────────────────────────
function ArcProgress({ pct }) {
  const r = 20, cx = 26, cy = 26;
  const circ = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;
  return (
    <div className="progress-arc-wrap">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8EDF2" strokeWidth="4"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}/>
      </svg>
      <div className="progress-arc-text">{Math.round(pct)}%</div>
    </div>
  );
}

// ─── Animated Bar ─────────────────────────────────────────────
function AnimBar({ score, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 100); return () => clearTimeout(t); }, [score]);
  return (
    <div className="dim-bar-track">
      <div className="dim-bar-fill" style={{ width: `${w}%`, background: color }}/>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div className="page">
      <div className="page-narrow">
        <div className="landing-hero">
          <div className="landing-eyebrow">LADD Academy · CORE Blueprint™</div>
          <h1 className="landing-headline">
            Know yourself.<br/>
            <em>Grow yourself.</em><br/>
            Lead yourself.
          </h1>
          <p className="landing-sub">
            A behavioral assessment built around four dimensions that shape everything you do — at your best, under pressure, and in the relationships that matter most.
          </p>
          <button className="btn btn-primary" onClick={onStart} style={{ fontSize: 16, padding: "18px 48px" }}>
            Begin Your Assessment →
          </button>
        </div>

        <div className="dims-grid">
          {[
            { l:"C", name:"Character", desc:"Who you are when no one is watching. Your internal compass." },
            { l:"O", name:"Orbit",     desc:"The world you create around you. How others experience your presence." },
            { l:"R", name:"Roots",     desc:"What you need to grow. The needs beneath your behavior." },
            { l:"E", name:"Edge",      desc:"Who you become when life presses in. Your pressure response." },
          ].map(d => (
            <div className="dim-card" key={d.l}>
              <div className="dim-letter">{d.l}</div>
              <div className="dim-name">{d.name}</div>
              <div className="dim-desc">{d.desc}</div>
            </div>
          ))}
        </div>

        <div className="details-row">
          <div className="detail-item"><span className="detail-icon">📋</span>72 questions</div>
          <div className="detail-item"><span className="detail-icon">⏱</span>12–15 minutes</div>
          <div className="detail-item"><span className="detail-icon">🔒</span>Private & confidential</div>
          <div className="detail-item"><span className="detail-icon">✨</span>Free report instantly</div>
        </div>

        <p className="disclaimer">
          The CORE Blueprint™ is a self-report behavioral development tool. It is not a clinical assessment and is not designed for use in hiring or employment decisions. Results reflect self-reported behavioral tendencies and are intended for personal growth purposes only. © 2026 LADD Academy.
        </p>
      </div>
    </div>
  );
}

// ─── Email Gate ───────────────────────────────────────────────
function EmailGate({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit() {
    if (!name.trim()) { setErr("Please enter your first name."); return; }
    if (!email.includes("@")) { setErr("Please enter a valid email address."); return; }
    onSubmit({ name: name.trim(), email: email.trim() });
  }

  return (
    <div className="page" style={{ justifyContent: "center", minHeight: "80vh" }}>
      <div className="gate-card">
        <div className="gate-icon">🌱</div>
        <h2 className="gate-title">Before we begin</h2>
        <p className="gate-sub">
          Enter your name and email to receive your free CORE Blueprint™ report. Your results will be waiting for you the moment you finish.
        </p>
        <div className="gate-form">
          <div className="gate-input-row">
            <input className="gate-input" placeholder="First name" value={name} onChange={e => { setName(e.target.value); setErr(""); }}/>
            <input className="gate-input" placeholder="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}/>
          </div>
          {err && <p style={{ color: "#C62828", fontSize: 13 }}>{err}</p>}
          <button className="btn btn-primary" onClick={handleSubmit} style={{ width: "100%", padding: "16px" }}>
            Start Assessment →
          </button>
          <p className="gate-disclaimer">
            We respect your privacy. Your assessment responses are confidential and will never be sold or shared. By continuing you agree to LADD Academy's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Assessment Engine ────────────────────────────────────────
function Assessment({ user, onComplete }) {
  const allQuestions = [
    ...likertQuestions.map(q => ({ ...q, layer: "likert" })),
    ...forcedChoiceQuestions.map(q => ({ ...q, layer: "fc" })),
    ...scenarioQuestions.map(q => ({ ...q, layer: "scenario" })),
  ];

  const [idx, setIdx]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [chosen, setChosen]   = useState(null);
  const topRef = useRef(null);

  const q    = allQuestions[idx];
  const pct  = (idx / allQuestions.length) * 100;
  const canNext = chosen !== null;

  const layerLabel = q.layer === "likert" ? "Part 1 of 3 — Frequency" :
                     q.layer === "fc"     ? "Part 2 of 3 — Preference" :
                                            "Part 3 of 3 — Situation";

  function advance(val) {
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    if (idx + 1 < allQuestions.length) {
      setChosen(null);
      setIdx(i => i + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      onComplete(newAnswers);
    }
  }

  function selectAndAdvance(val) {
    setChosen(val);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => advance(val));
    });
  }

  function back() {
    if (idx > 0) {
      setIdx(idx - 1);
      setChosen(answers[allQuestions[idx - 1].id] ?? null);
    }
  }

  return (
    <>
      <div className="progress-header" ref={topRef}>
        <ArcProgress pct={pct} />
        <div className="progress-meta">
          <div className="progress-layer">{layerLabel}</div>
          <div className="progress-label">Question {idx + 1} of {allQuestions.length}</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }}/>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="page-narrow">
          <div className="q-wrap" key={`wrap-${idx}`}>
            <div className="q-card" key={`card-${q.id}`}>
              <div className="q-type-badge">
                {q.layer === "likert" ? "How often is this true of you?" :
                 q.layer === "fc"     ? "Which is more consistently true?" :
                                        "What would you actually do?"}
              </div>

              {/* LIKERT */}
              {q.layer === "likert" && (
                <>
                  <p className="q-text">{q.text}</p>
                  <div className="likert-options">
                    {[1,2,3,4,5].map(v => (
                      <button key={v} className={`likert-btn${chosen === v ? " selected" : ""}`}
                        onClick={() => selectAndAdvance(v)}>{v}</button>
                    ))}
                  </div>
                  <div className="likert-labels">
                    <span className="likert-label">Rarely true</span>
                    <span className="likert-label">Almost always true</span>
                  </div>
                </>
              )}

              {/* FORCED CHOICE */}
              {q.layer === "fc" && (
                <div className="fc-options">
                  <button className={`fc-btn${chosen === "a" ? " selected" : ""}`}
                    onClick={() => selectAndAdvance("a")}>{q.a}</button>
                  <div className="fc-divider">OR</div>
                  <button className={`fc-btn${chosen === "b" ? " selected" : ""}`}
                    onClick={() => selectAndAdvance("b")}>{q.b}</button>
                </div>
              )}

              {/* SCENARIO */}
              {q.layer === "scenario" && (
                <>
                  <div className="scenario-text">{q.text}</div>
                  <div className="sc-options">
                    {q.options.map((opt, i) => (
                      <button key={i} className={`sc-btn${chosen === i ? " selected" : ""}`}
                        onClick={() => selectAndAdvance(i)}>
                        <span className="sc-letter">{String.fromCharCode(65+i)}</span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="q-nav">
              <button className="btn btn-outline btn-sm" onClick={back} disabled={idx === 0}
                style={{ opacity: idx === 0 ? 0.4 : 1 }}>← Back</button>
              <span className="q-counter">{idx + 1} / {allQuestions.length}</span>
              {canNext && (
                <button className="btn btn-primary btn-sm" onClick={() => advance(chosen)}>Next →</button>
              )}
              {!canNext && <div style={{ width: 80 }}/>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Free Report ──────────────────────────────────────────────
function PrintSaveButtons({ isPaid = false }) {
  return (
    <div className="report-actions">
      <button className="btn-print" onClick={() => window.print()}>
        🖨 Print Report
      </button>
      <button className="btn-print" onClick={() => window.print()}>
        💾 Save as PDF
      </button>
      {!isPaid && (
        <span style={{ fontSize: 12, color: "#aaa", alignSelf: "center", marginLeft: 4 }}>
          Tip: In print dialog, choose "Save as PDF" to download
        </span>
      )}
    </div>
  );
}

function ReportSidebar({ type, dimScores, isPaid = false }) {
  const dimColors = { C: "#4A7FA5", O: GOLD, R: "#2E7D6E", E: "#7B3F9E" };
  const dimNames  = { C: "Character", O: "Orbit", R: "Roots", E: "Edge" };
  return (
    <div className="report-sidebar">
      <div className="sidebar-identity">
        <span className="sidebar-emoji">{type.emoji}</span>
        <div className="sidebar-type-name">{type.name}</div>
        <div className="sidebar-tagline">"{type.tagline}"</div>
        <div className="sidebar-family">A {type.family} Type</div>
        <div className="sidebar-dim-bars">
          {Object.entries(dimScores).map(([dim, score]) => (
            <div className="sidebar-dim-row" key={dim}>
              <div className="sidebar-dim-label">
                <span className="sidebar-dim-name">{dimNames[dim]}</span>
                <span className="sidebar-dim-score">{score}</span>
              </div>
              <div className="sidebar-dim-track">
                <div className="sidebar-dim-fill" style={{ width: `${score}%`, background: dimColors[dim] }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-nav-title">In This Report</div>
        {[
          { icon: "🪞", label: "Core Identity" },
          { icon: "✦",  label: "Your Reach" },
          { icon: "🌱", label: "Your Roots" },
          { icon: "🤝", label: "How You Serve Others" },
          ...(isPaid ? [
            { icon: "🌪", label: "Your Drift Profile" },
            { icon: "◈",  label: "Trigger Map" },
            { icon: "💼", label: "Work & Leadership" },
            { icon: "🌿", label: "Growth Edges" },
            { icon: "🗺",  label: "Career Alignment" },
          ] : [
            { icon: "🌪", label: "Your Edge — Preview" },
          ])
        ].map(({ icon, label }) => {
          const idMap = {
            "Core Identity":       "section-core-identity",
            "Your Reach":          "section-your-reach",
            "Your Roots":          "section-your-roots",
            "How You Serve Others":"section-how-you-serve",
            "Your Edge — Preview": "section-how-you-serve",
            "Your Drift Profile":  "section-drift-profile",
            "Trigger Map":         "section-trigger-map",
            "Work & Leadership":   "section-work-leadership",
            "Growth Edges":        "section-growth-edges",
            "Career Alignment":    "section-career-alignment",
          };
          function scrollTo() {
            const id = idMap[label];
            if (!id) return;
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          return (
            <div className="sidebar-nav-item" key={label}
              onClick={scrollTo}
              style={{ cursor: "pointer" }}
            >
              <span className="sidebar-nav-icon">{icon}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FreeReport({ user, result, onUpgrade }) {
  const { type, dimScores } = result;
  const dimColors = { C: "#4A7FA5", O: GOLD, R: "#2E7D6E", E: "#7B3F9E" };

  return (
    <div className="page">
      <div className="report-wrap">
        <PrintSaveButtons isPaid={false} />

        {/* Two-column layout on desktop */}
        <div className="report-layout">
        <ReportSidebar type={type} dimScores={dimScores} isPaid={false}/>
        <div className="report-main">

        {/* Hero */}
        <div className="report-hero">
          <div className="report-greeting">Your CORE Blueprint™, {user.name}</div>
          <span className="report-type-emoji">{type.emoji}</span>
          <div className="report-type-name">{type.name}</div>
          <div className="report-tagline">"{type.tagline}"</div>
          <div className="report-family-badge">
            <span>⬡</span>
            <span>A {type.family} type</span>
          </div>
        </div>

        {/* Identity */}
        <div className="report-section" id="section-core-identity">
          <div className="section-eyebrow">Who You Are</div>
          <div className="section-title">Your Core Identity</div>
          <p className="section-body">{type.identity}</p>
        </div>

        {/* Dimension Scores */}
        <div className="report-section">
          <div className="section-eyebrow">Your CORE Profile</div>
          <div className="section-title">Dimension Scores</div>
          <div className="dim-bars">
            {Object.entries(dimScores).map(([dim, score]) => (
              <div className="dim-bar-row" key={dim}>
                <div className="dim-bar-label">
                  <div>
                    <span className="dim-bar-name">{dim} — {["C","O","R","E"].includes(dim) ? {C:"Character",O:"Orbit",R:"Roots",E:"Edge"}[dim] : dim}</span>
                    <span className="dim-bar-desc" style={{ marginLeft: 8 }}>
                      {{ C:"Internal standards", O:"Relational presence", R:"Core needs", E:"Pressure response" }[dim]}
                    </span>
                  </div>
                  <span className="dim-bar-score">{score}</span>
                </div>
                <AnimBar score={score} color={dimColors[dim]}/>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="report-section">
          <div className="section-eyebrow">Your Anchor Values</div>
          <div className="section-title">What You Stand On</div>
          <p className="section-body" style={{ marginBottom: 16 }}>
            These five values are the behavioral anchors most characteristic of your type — the principles that show up in how you make decisions, relate to others, and define yourself.
          </p>
          <div className="values-chips">
            {type.values.map(v => <span className="value-chip" key={v}>{v}</span>)}
          </div>
        </div>

        {/* Reach */}
        <div className="report-section" id="section-your-reach">
          <div className="section-eyebrow">Your Reach</div>
          <div className="section-title">You at Your Best</div>
          <p className="section-body" style={{ marginBottom: 20 }}>
            These are the behaviors that show up most naturally when you are grounded, secure, and thriving — your best self expressed outward.
          </p>
          <div className="reach-list">
            {type.reach.map((r, i) => (
              <div className="reach-item" key={i}>
                <span className="reach-icon">✦</span>
                <span className="reach-text">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roots / Need */}
        <div className="report-section" id="section-your-roots">
          <div className="section-eyebrow">Your Roots</div>
          <div className="section-title">What You Need to Thrive</div>
          <p className="section-body" style={{ marginBottom: 20 }}>
            Understanding your deepest need explains not just your behavior, but the <em>why beneath the behavior</em> — in relationships, in conflict, and under pressure.
          </p>
          <div className="need-block">
            <div className="need-name">Your Primary Need: {type.primaryNeed}</div>
            <div className="need-desc">{type.needDesc}.</div>
          </div>
        </div>

        {/* Serves Others */}
        <div className="report-section" id="section-how-you-serve">
          <div className="section-eyebrow">How You Show Up</div>
          <div className="section-title">How You Serve Others</div>
          <p className="serves-text">"{type.servesOthers}"</p>
        </div>

        {/* Drift Tease */}
        <div className="drift-tease-card">
          <div className="drift-tease-eyebrow">Your Edge — A Glimpse</div>
          <div className="drift-tease-title">When Life Presses In…</div>
          <p className="drift-tease-text">"{type.driftTease}"</p>
          <button className="btn btn-gold" onClick={onUpgrade}>
            Unlock Your Full Blueprint →
          </button>
        </div>

        {/* Upgrade CTA */}
        <div className="upgrade-card">
          <div className="upgrade-eyebrow">Your Full Blueprint</div>
          <div className="upgrade-title">You've seen your Reach.<br/>Now discover what shapes your Drift.</div>
          <p className="upgrade-sub">
            Your Full Blueprint reveals your complete pressure behavior profile, the specific triggers that activate your Drift, and the three growth edges that matter most for you right now.
          </p>
          <div className="upgrade-bullets">
            {[
              "Full Drift Profile — 3 specific pressure behaviors named and described",
              "Your Trigger Map — the exact conditions that activate your Drift",
              "Work & Leadership domain behaviors",
              "Where you fall short — honest, compassionate insight",
              "3 Growth Edges — specific, actionable development steps",
              "Career & environment alignment guide",
            ].map((b, i) => (
              <div className="upgrade-bullet" key={i}>
                <span className="upgrade-bullet-icon">✦</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="upgrade-price">
            <span className="upgrade-price-amount">$24</span>
            <span className="upgrade-price-period">one-time</span>
          </div>
          <div className="upgrade-price-note">Instant access · Downloadable PDF included</div>
          <button className="btn btn-gold" onClick={onUpgrade} style={{ fontSize: 16, padding: "18px 56px" }}>
            Unlock Full Blueprint — $24 →
          </button>
        </div>

        <p className="disclaimer">
          The CORE Blueprint™ is a self-report behavioral development tool. It is not a clinical assessment and is not designed for use in hiring or employment decisions. Results reflect self-reported tendencies and are for personal growth purposes only. © 2026 LADD Academy. All Rights Reserved.
        </p>

        </div>{/* end report-main */}
        </div>{/* end report-layout */}
      </div>
    </div>
  );
}

// ─── Paid Report ──────────────────────────────────────────────
function ImpactLayer({ growth }) {
  return (
    <div className="report-section">
      <div className="section-eyebrow">The Impact Layer</div>
      <div className="section-title">What Others Experience</div>
      <p className="section-body" style={{ marginBottom: 24 }}>
        Understanding your behavior is the first layer. Understanding what others experience because of your behavior is where real growth begins. These are not judgments — they are mirrors.
      </p>
      {growth.impactLayer.map((item, i) => (
        <div className="impact-card" key={i}>
          <div className="impact-drift-name">{item.drift}</div>
          <div className="impact-block">
            <div className="impact-block-label">What you do</div>
            <div className="impact-block-text">{item.whatYouDo}</div>
          </div>
          <div className="impact-block">
            <div className="impact-block-label">What it costs you</div>
            <div className="impact-block-text">{item.whatItCosts}</div>
          </div>
          <div className="impact-block">
            <div className="impact-block-label">What others experience</div>
            <div className="impact-block-text">{item.whatOthersExperience}</div>
          </div>
          <div className="impact-invitation">
            <div className="impact-invitation-label">The Invitation</div>
            {item.theInvitation}
          </div>
        </div>
      ))}
    </div>
  );
}

function PerceptionGap({ growth }) {
  return (
    <div className="report-section">
      <div className="section-eyebrow">The Perception Gap</div>
      <div className="section-title">Intent vs. Impact</div>
      <p className="section-body" style={{ marginBottom: 24 }}>
        The gap between how you experience your own behavior and how others experience it is often where the most important growth lives. These are not accusations — they are invitations to close a distance you may not have known existed.
      </p>
      <table className="perception-table">
        <thead>
          <tr>
            <th>How you see it</th>
            <th>How others often experience it</th>
          </tr>
        </thead>
        <tbody>
          {growth.perceptionGap.map((row, i) => (
            <tr key={i}>
              <td>"{row.howYouSeeIt}"</td>
              <td>"{row.howOthersExperienceIt}"</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GrowthGuide({ type, growth }) {
  return (
    <>
      <div className="paid-section-divider">
        <span className="paid-section-icon">🌿</span>
        <div>
          <div className="paid-section-title">Your CORE Growth Guide</div>
          <div className="paid-section-sub">Triggered practices, reflection questions, and action prompts</div>
        </div>
      </div>

      <div className="report-section">
        <div className="section-eyebrow">How to Use This Guide</div>
        <div className="section-title">Development That Meets You in Real Life</div>
        <p className="section-body">
          Each growth edge below has four components. The <strong>trigger</strong> is the specific real-life moment that calls for this practice — don't schedule it, wait for the moment. The <strong>practice</strong> is what to do differently when that moment arrives. The <strong>reflection</strong> is a question to sit with in quiet. The <strong>action</strong> is one concrete thing to do this week. And the <strong>signal</strong> tells you how you'll know it's working.
        </p>
        <p className="section-body" style={{ marginTop: 12 }}>
          You don't need to work through all three at once. Start with the one that made you uncomfortable when you read it. That discomfort is information.
        </p>
      </div>

      {growth.growthEdges.map((ge, i) => (
        <div className="practice-card" key={i}>
          <div className="practice-edge-title">
            Growth Edge {i + 1} — {ge.edge}
          </div>
          <div className="practice-block">
            <div className="practice-block-label">🎯 When this happens</div>
            <div className="practice-block-text">{ge.trigger}</div>
          </div>
          <div className="practice-block">
            <div className="practice-block-label">⚡ Try this</div>
            <div className="practice-block-text">{ge.practice}</div>
          </div>
          <div className="practice-block">
            <div className="practice-block-label">💭 Sit with this</div>
            <div className="practice-block-text">{ge.reflection}</div>
          </div>
          <div className="practice-block">
            <div className="practice-block-label">✦ This week</div>
            <div className="practice-block-text">{ge.action}</div>
          </div>
          <div className="practice-signal">
            <span className="practice-signal-label">You'll know it's working when…</span>
            {ge.signal}
          </div>
        </div>
      ))}
    </>
  );
}

function ForThoseWhoKnowYou({ type, growth }) {
  const ftyky = growth.forThoseWhoKnowYou;
  return (
    <div className="ftyky-card">
      <div className="ftyky-eyebrow">A Note for Someone Who Knows You</div>
      <div className="ftyky-title">For Those Who Know You</div>
      <div className="ftyky-opening">{ftyky.opening}</div>

      <div className="ftyky-section-title">Who They Are</div>
      <div className="ftyky-body">{ftyky.whoTheyAre}</div>

      <div className="ftyky-section-title">What They Need From You</div>
      <div className="ftyky-list">
        {ftyky.whatTheyNeed.map((need, i) => (
          <div className="ftyky-list-item" key={i}>
            <span className="ftyky-bullet">✦</span>
            <span>{need}</span>
          </div>
        ))}
      </div>

      <div className="ftyky-section-title">What They're Working On</div>
      <div className="ftyky-body">{ftyky.whatTheyreWorkingOn}</div>

      <div className="ftyky-never">
        <div className="ftyky-never-label">One Thing to Never Do</div>
        <div className="ftyky-never-text">{ftyky.neverDo}</div>
      </div>

      <div className="ftyky-closing">{ftyky.closing}</div>
    </div>
  );
}

function PaidReport({ user, result }) {
  const { type, dimScores } = result;
  const growth = GROWTH_CONTENT[result.typeKey];

  return (
    <div className="page">
      <div className="report-wrap">
        <PrintSaveButtons isPaid={true} />

        <div className="report-layout">
        <ReportSidebar type={type} dimScores={dimScores} isPaid={true}/>
        <div className="report-main">

        {/* Hero */}
        <div className="report-hero">
          <div className="report-greeting">Full Blueprint — {user.name}</div>
          <span className="report-type-emoji">{type.emoji}</span>
          <div className="report-type-name">{type.name}</div>
          <div className="report-tagline">"{type.tagline}"</div>
          <div className="report-family-badge"><span>⬡</span><span>A {type.family} type · Full Blueprint</span></div>
        </div>

        {/* Free content preserved */}
        <div className="free-summary-card">
          <div className="free-summary-label">Your Foundation</div>
          <p className="section-body" style={{ marginBottom: 16 }}>{type.identity}</p>
          <div className="values-chips" style={{ marginBottom: 16 }}>
            {type.values.map(v => <span className="value-chip" key={v}>{v}</span>)}
          </div>
          <div className="reach-list">
            {type.reach.map((r, i) => (
              <div className="reach-item" key={i}>
                <span className="reach-icon">✦</span>
                <span className="reach-text">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs */}
        <div className="report-section" id="section-your-roots">
          <div className="section-eyebrow">Your Roots</div>
          <div className="section-title">What You Need to Thrive</div>
          <div className="need-block">
            <div className="need-name">Your Primary Need: {type.primaryNeed}</div>
            <div className="need-desc">{type.needDesc}.</div>
          </div>
          <p className="section-body" style={{ marginTop: 20 }}>{type.servesOthers}</p>
        </div>

        {/* Drift section */}
        <div className="paid-section-divider">
          <span className="paid-section-icon">🌪</span>
          <div>
            <div className="paid-section-title">Your Edge — In Full</div>
            <div className="paid-section-sub">Drift behaviors, impact, and perception gaps</div>
          </div>
        </div>

        {/* Drift behaviors */}
        <div className="report-section">
          <div className="section-eyebrow" id="section-drift-profile">Your Drift Profile</div>
          <div className="section-title">Who You Become Under Pressure</div>
          <p className="section-body" style={{ marginBottom: 24 }}>
            These are not your flaws — they are your signals. They are the specific patterns that emerge when you are depleted, threatened, or when your core needs go unmet. Recognizing them is the beginning of the most important work you will do.
          </p>
          {type.drift.map((d, i) => {
            const [title, ...rest] = d.split(" — ");
            return (
              <div className="drift-card" key={i}>
                <div className="drift-card-title">{title}</div>
                <div className="drift-card-text">{rest.join(" — ")}</div>
              </div>
            );
          })}
        </div>

        {/* Impact Layer */}
        {growth && <ImpactLayer growth={growth}/>}

        {/* Perception Gap */}
        {growth && <PerceptionGap growth={growth}/>}

        {/* Trigger Map */}
        <div className="report-section">
          <div className="section-eyebrow" id="section-trigger-map">Your Trigger Map</div>
          <div className="section-title">What Activates Your Drift</div>
          <p className="section-body" style={{ marginBottom: 20 }}>
            These are the specific conditions most likely to move you from your Reach into your Drift. Knowing your triggers before they fire is the difference between choosing your response and being chosen by it.
          </p>
          <div className="trigger-list">
            {type.triggers.map((t, i) => (
              <div className="trigger-item" key={i}>
                <span className="trigger-icon">◈</span>
                <span className="trigger-text">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work & Leadership */}
        <div className="paid-section-divider">
          <span className="paid-section-icon">💼</span>
          <div>
            <div className="paid-section-title">Work & Leadership</div>
            <div className="paid-section-sub">How you show up professionally</div>
          </div>
        </div>

        <div className="report-section">
          <div className="section-eyebrow" id="section-work-leadership">Your Professional Presence</div>
          <div className="section-title">At Work & With Peers</div>
          <p className="section-body" style={{ marginBottom: 20 }}>
            Your {type.family.slice(0,-1).toLowerCase()} orientation shapes how you engage in professional environments. Your colleagues and teams typically experience these strengths in you:
          </p>
          <div className="reach-list">
            {type.reach.map((r, i) => (
              <div className="reach-item" key={i}>
                <span className="reach-icon">✦</span>
                <span className="reach-text">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <div className="section-eyebrow">Where You Fall Short</div>
          <div className="section-title">Your Leadership Blind Spots</div>
          <p className="section-body" style={{ marginBottom: 20 }}>
            Every strength overextended becomes a liability. These are the specific ways your natural gifts can — under pressure — work against the people and outcomes you care most about.
          </p>
          {type.drift.slice(0,2).map((d, i) => {
            const [title, ...rest] = d.split(" — ");
            return (
              <div className="drift-card" key={i}>
                <div className="drift-card-title">In a professional context: {title.toLowerCase()}</div>
                <div className="drift-card-text">{rest.join(" — ")}</div>
              </div>
            );
          })}
        </div>

        <div className="report-section">
          <div className="section-eyebrow" id="section-career-alignment">Career & Environment</div>
          <div className="section-title">Where You Thrive</div>
          <p className="section-body" style={{ marginBottom: 16 }}>
            Your primary need for <strong>{type.primaryNeed}</strong> means you bring your best in environments where:
          </p>
          <div className="reach-list">
            {[
              "Your contributions are visible and their impact is acknowledged",
              "Relationships are built on trust, honesty, and consistent follow-through",
              "Growth — personal or organizational — is an active priority, not an afterthought",
              "You have enough clarity about expectations to operate with genuine confidence",
            ].map((r, i) => (
              <div className="reach-item" key={i}>
                <span className="reach-icon">✦</span>
                <span className="reach-text">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Guide */}
        {growth && <GrowthGuide type={type} growth={growth}/>}

        {/* Coaching note */}
        <div style={{ background: LTBLUE, borderRadius: 16, padding: "32px 36px", marginBottom: 24 }}>
          <div className="section-eyebrow" style={{ marginBottom: 8 }}>For Coaches & Facilitators</div>
          <div className="section-title" style={{ marginBottom: 12 }}>Working with This Profile</div>
          <p className="section-body">
            When coaching a {type.name}, the most productive entry point is their <strong>{type.primaryNeed}</strong> need. Ask: <em>Where does this need feel most met right now — and where doesn't it?</em> The answer will almost always reveal the context in which their Drift behaviors are most active. Growth conversations land best when the client's strength is fully honored before their Drift is named. Use the Perception Gap table to open the most important coaching conversation — the gap between intent and impact.
          </p>
        </div>

        {/* For Those Who Know You */}
        {growth && <ForThoseWhoKnowYou type={type} growth={growth}/>}

        <p className="disclaimer">
          The CORE Blueprint™ is a self-report behavioral development tool. It is not a clinical assessment and is not designed for use in hiring or employment decisions. Results reflect self-reported tendencies and are for personal growth purposes only. © 2026 LADD Academy. All Rights Reserved.
        </p>

        </div>{/* end report-main */}
        </div>{/* end report-layout */}
      </div>
    </div>
  );
}

// ─── Mock Paywall ─────────────────────────────────────────────
function Paywall({ onPay }) {
  const [loading, setLoading] = useState(false);

  function handlePay() {
    setLoading(true);
    // In production this calls Stripe Checkout
    setTimeout(() => { setLoading(false); onPay(); }, 1800);
  }

  return (
    <div className="page" style={{ justifyContent: "center", minHeight: "80vh" }}>
      <div className="gate-card" style={{ maxWidth: 560 }}>
        <div className="gate-icon">📘</div>
        <h2 className="gate-title">Unlock Your Full Blueprint</h2>
        <p className="gate-sub">
          Your Full Blueprint includes your complete Drift Profile, Trigger Map, Work & Leadership insights, 3 Growth Edges, and Career Alignment guide.
        </p>
        <div className="upgrade-bullets" style={{ textAlign: "left", marginBottom: 28 }}>
          {["Full Drift Profile","Trigger Map","Work & Leadership domain","Where you fall short","3 Growth Edges","Career alignment","Downloadable PDF"].map((b,i)=>(
            <div className="upgrade-bullet" key={i} style={{ color: GRAY }}>
              <span style={{ color: GOLD }}>✦</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="upgrade-price" style={{ marginBottom: 4 }}>
          <span className="upgrade-price-amount" style={{ color: NAVY }}>$24</span>
          <span className="upgrade-price-period" style={{ color: "#888" }}>one-time</span>
        </div>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>Secure payment · Instant access · PDF included</p>
        <button className="btn btn-gold" onClick={handlePay} disabled={loading} style={{ width: "100%", padding: "18px" }}>
          {loading ? "Processing…" : "Unlock Full Blueprint — $24 →"}
        </button>
        <p className="gate-disclaimer" style={{ marginTop: 16 }}>
          Secure checkout powered by Stripe. 30-day satisfaction guarantee. This is a demonstration — no real payment is processed in this prototype.
        </p>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | gate | assessment | freeReport | paywall | paidReport
  const [user,   setUser]   = useState(null);
  const [result, setResult] = useState(null);
  const [paid,   setPaid]   = useState(false);

  function handleStart()        { setScreen("gate"); }
  function handleGate(u)        { setUser(u); setScreen("assessment"); }
  function handleComplete(ans)  { setResult(scoreAssessment(ans)); setScreen("freeReport"); }
  function handleUpgrade()      { setScreen("paywall"); }
  function handlePay()          { setPaid(true); setScreen("paidReport"); }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-logo">
            <div className="topbar-brand">LADD Academy</div>
            <div className="topbar-title">CORE <span>Blueprint™</span></div>
          </div>
          <div className="topbar-right">
            {screen === "assessment" && "Answer honestly — there are no right or wrong answers"}
            {(screen === "freeReport" || screen === "paidReport") && (user ? `${user.name}'s Report` : "")}
          </div>
        </header>

        {/* Screens */}
        {screen === "landing"     && <Landing   onStart={handleStart} />}
        {screen === "gate"        && <EmailGate onSubmit={handleGate} />}
        {screen === "assessment"  && <Assessment user={user} onComplete={handleComplete} />}
        {screen === "freeReport"  && result && <FreeReport user={user} result={result} onUpgrade={handleUpgrade} />}
        {screen === "paywall"     && <Paywall onPay={handlePay} />}
        {screen === "paidReport"  && result && <PaidReport user={user} result={result} />}
      </div>
    </>
  );
}
