import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { DEMO_MEETING_1_ID } from '../utils/seedData'

const TOUR_KEY = 'boardalign_tour_seen'
const TOOLTIP_W = 360
const GAP = 14
const MARGIN = 16
const SPOTLIGHT_PAD = 8

// ── Step definitions ──────────────────────────────────────────────────────────

function buildSteps() {
  return [
    {
      target: `[data-tour="meeting-card-${DEMO_MEETING_1_ID}"]`,
      title: 'Your upcoming meetings',
      body: "This is your pre-meeting workspace. Each card represents a board meeting where you have modeled your board's likely positions. The colored badge on the right shows overall alignment risk — this one is flagged as 'At Risk' because one director opposes a key item.",
      note: 'The demo data here reflects a real pre-Series B scenario with four directors across three decisions.',
    },
    {
      target: `[data-tour="risk-badge-${DEMO_MEETING_1_ID}"]`,
      title: 'At a glance: alignment risk',
      body: 'Green means your board is broadly aligned. Amber means mixed views that need preparation. Red means at least one director is opposed to something — and you need to know that before you walk in, not after the vote.',
    },
    {
      target: `[data-tour="meeting-card-${DEMO_MEETING_1_ID}"]`,
      title: 'Click to open the Alignment Report',
      body: 'Clicking this card opens the full pre-meeting intelligence report — stance distributions, key objectors, prep briefs, and suggested time allocation per decision.',
      navigateTo: ['alignment-report', DEMO_MEETING_1_ID],
    },
    {
      target: '[data-tour="report-status-badge"]',
      title: 'Overall meeting risk at a glance',
      body: "This reflects the aggregate stance across all decisions and all board members. 'At Risk' here is driven by one director opposing the bridge financing authorization — a situation that would blindside most founders in the room.",
    },
    {
      target: '[data-tour="decision-card-report-0"]',
      title: 'Decision-level alignment',
      body: 'The stacked bar shows the distribution of stances across your board. Here: 2 Support, 1 Neutral, 1 Concerned. The tool identifies Marcus Webb as the member requiring attention — and surfaces his exact reasoning and the specific condition that would shift him to Support.',
      note: 'This is the difference between being surprised by an objection in the room and having already prepared your response to it.',
    },
    {
      target: '[data-tour="decision-card-2-objectors"]',
      title: 'The objector intelligence block',
      body: "This decision is flagged Red. Marcus Webb is opposed — not just concerned. His reasoning: authorizing the bridge before exhausting the timeline sends a signal of desperation to the Series B lead. His change condition: if due diligence slips past 10 weeks with no term sheet reaffirmation. Now you know exactly what argument to prepare.",
      note: 'A board member with no change condition is a vote. One with a change condition is a thinking partner. The difference matters.',
    },
    {
      target: '[data-tour="prep-brief-section"]',
      title: 'Your meeting strategy, auto-generated',
      body: "This tells you how to allocate the meeting's time before you arrive. The European expansion gets 20 minutes — one concerned voice to address. The CTO promotion gets 10 minutes — full alignment, minimal deliberation needed. The bridge financing gets 35 minutes — genuine opposition that requires structured discussion.",
    },
    {
      target: '[data-tour="philosophy-note"]',
      title: 'The gap is your real board intelligence',
      body: "If a director who appeared Opposed here votes yes in the meeting without raising the objection, ask yourself why. That silence — caused by social pressure, sequential speaking order, or reciprocity between co-investors — is exactly the problem this tool exists to surface before it becomes invisible.",
      isFinal: true,
    },
  ]
}

// ── Position helpers ──────────────────────────────────────────────────────────

function calcTooltipPos(rect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const cx = (rect.left + rect.right) / 2
  const cy = (rect.top + rect.bottom) / 2
  const tooltipHEst = 280

  let top, arrowDir
  if (cy < vh * 0.5) {
    top = rect.bottom + GAP
    arrowDir = 'top'
  } else {
    top = rect.top - tooltipHEst - GAP
    arrowDir = 'bottom'
  }

  top = Math.max(MARGIN, Math.min(top, vh - tooltipHEst - MARGIN))

  let left = cx - TOOLTIP_W / 2
  left = Math.max(MARGIN, Math.min(left, vw - TOOLTIP_W - MARGIN))

  const arrowLeft = Math.max(20, Math.min(TOOLTIP_W - 28, cx - left))

  return { top, left, arrowDir, arrowLeft }
}

// ── Highlight helpers ─────────────────────────────────────────────────────────

function applyHighlight(el) {
  el.dataset.tourOrigZIndex = el.style.zIndex || ''
  el.dataset.tourOrigPosition = el.style.position || ''
  const computed = window.getComputedStyle(el).position
  if (computed === 'static') el.style.position = 'relative'
  el.style.zIndex = '1001'
  el.classList.add('tour-highlight')
}

function removeHighlight(el) {
  if (!el) return
  el.classList.remove('tour-highlight')
  el.style.zIndex = el.dataset.tourOrigZIndex || ''
  el.style.position = el.dataset.tourOrigPosition || ''
  delete el.dataset.tourOrigZIndex
  delete el.dataset.tourOrigPosition
}

// ── Welcome Modal ─────────────────────────────────────────────────────────────

function WelcomeModal({ onStart, onSkip }) {
  return (
    <div className="tour-welcome-overlay" role="dialog" aria-modal="true">
      <div className="tour-welcome-card">
        <div className="tour-welcome-label">BoardAlign</div>
        <h2 className="tour-welcome-title">
          Understand your board before you walk in the room.
        </h2>
        <p className="tour-welcome-body">
          Most founders discover where their board stands during the meeting — when social pressure,
          speaking order, and reciprocity dynamics are already shaping every response. BoardAlign helps
          you map alignment in advance, so the meeting becomes a space for genuine deliberation rather
          than managed consensus.
        </p>
        <div className="tour-welcome-separator" />
        <p className="tour-welcome-note">
          This tour takes 90 seconds. It walks you through a realistic board scenario — a pre-Series B
          meeting with four directors — and shows you exactly how the tool works.
        </p>
        <div className="tour-welcome-actions">
          <button className="btn btn-primary" onClick={onStart}>
            Take the Tour →
          </button>
          <button className="btn btn-text" onClick={onSkip}>
            Skip — go straight to the app
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Spotlight ─────────────────────────────────────────────────────────────────

function Spotlight({ rect }) {
  if (!rect) {
    return <div className="tour-overlay-full" />
  }

  const top    = Math.max(0, rect.top - SPOTLIGHT_PAD)
  const left   = Math.max(0, rect.left - SPOTLIGHT_PAD)
  const bottom = Math.min(window.innerHeight, rect.bottom + SPOTLIGHT_PAD)
  const right  = Math.min(window.innerWidth, rect.right + SPOTLIGHT_PAD)
  const h      = bottom - top

  const base = { position: 'fixed', background: 'rgba(0,0,0,0.55)', zIndex: 1000, pointerEvents: 'all' }

  return (
    <>
      <div style={{ ...base, top: 0, left: 0, right: 0, height: top }} />
      <div style={{ ...base, top: bottom, left: 0, right: 0, bottom: 0 }} />
      <div style={{ ...base, top, left: 0, width: left, height: h }} />
      <div style={{ ...base, top, left: right, right: 0, height: h }} />
    </>
  )
}

// ── Tooltip Card ──────────────────────────────────────────────────────────────

function TooltipCard({ step, stepIndex, total, pos, onNext, onBack, onExit }) {
  return (
    <div
      className="tour-tooltip"
      style={{ top: pos.top, left: pos.left, width: TOOLTIP_W }}
      role="dialog"
      aria-live="polite"
    >
      {/* Arrow */}
      {pos.arrowDir === 'top' && (
        <div className="tour-arrow tour-arrow-up" style={{ left: pos.arrowLeft }} />
      )}
      {pos.arrowDir === 'bottom' && (
        <div className="tour-arrow tour-arrow-down" style={{ left: pos.arrowLeft }} />
      )}

      <button className="tour-exit-btn" onClick={onExit} aria-label="Exit tour">
        Exit tour
      </button>

      <div className="tour-tooltip-title">{step.title}</div>
      <div className="tour-tooltip-body">{step.body}</div>
      {step.note && <div className="tour-tooltip-note">{step.note}</div>}

      <div className="tour-tooltip-footer">
        <span className="tour-step-count">Step {stepIndex + 1} of {total}</span>
        <div className="tour-nav-btns">
          <button
            className="tour-back-btn"
            onClick={onBack}
            disabled={stepIndex === 0}
          >
            ← Back
          </button>
          <button className="btn btn-primary" style={{ height: 32, fontSize: 13 }} onClick={onNext}>
            {step.isFinal ? 'Finish tour →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingTour({ navigate }) {
  const [phase, setPhase] = useState(() =>
    localStorage.getItem(TOUR_KEY) ? 'done' : 'welcome'
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ top: -9999, left: -9999, arrowDir: 'top', arrowLeft: 180 })

  const highlightedRef = useRef(null)
  const timerRef = useRef(null)
  const mountedRef = useRef(true)

  const steps = useMemo(() => buildSteps(), [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
      if (highlightedRef.current) removeHighlight(highlightedRef.current)
    }
  }, [])

  // ── Find & position on step change ───────────────────────────────────────

  useEffect(() => {
    if (phase !== 'touring') return

    clearTimeout(timerRef.current)
    let attempts = 0

    function tryFind() {
      if (!mountedRef.current) return
      const step = steps[stepIndex]
      if (!step) return

      const el = document.querySelector(step.target)

      if (!el) {
        if (++attempts < 30) {
          timerRef.current = setTimeout(tryFind, 100)
        }
        return
      }

      // Swap highlight
      if (highlightedRef.current && highlightedRef.current !== el) {
        removeHighlight(highlightedRef.current)
      }
      if (highlightedRef.current !== el) {
        applyHighlight(el)
        highlightedRef.current = el
      }

      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Wait for scroll to settle
      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return
        const rect = el.getBoundingClientRect()
        const plain = { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
        setTargetRect(plain)
        setTooltipPos(calcTooltipPos(plain))
      }, 380)
    }

    tryFind()
  }, [stepIndex, phase, steps])

  // ── Reposition on scroll / resize ────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'touring') return

    function reposition() {
      const el = highlightedRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const plain = { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
      setTargetRect(plain)
      setTooltipPos(calcTooltipPos(plain))
    }

    window.addEventListener('scroll', reposition, { passive: true })
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition)
      window.removeEventListener('resize', reposition)
    }
  }, [phase])

  // ── Keyboard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'touring') return

    function handleKey(e) {
      if (e.key === 'ArrowRight') { handleNext(); e.preventDefault() }
      else if (e.key === 'ArrowLeft') { handleBack(); e.preventDefault() }
      else if (e.key === 'Escape') { exitTour() }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepIndex])

  // ── Actions ───────────────────────────────────────────────────────────────

  const finishTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, 'true')
    if (highlightedRef.current) {
      removeHighlight(highlightedRef.current)
      highlightedRef.current = null
    }
    setTargetRect(null)
    setPhase('done')
  }, [])

  const exitTour = useCallback(() => finishTour(), [finishTour])

  const handleNext = useCallback(() => {
    const step = steps[stepIndex]
    if (!step) return

    if (step.isFinal) {
      finishTour()
      return
    }

    if (step.navigateTo) {
      navigate(step.navigateTo[0], step.navigateTo[1])
    }

    setStepIndex(i => i + 1)
  }, [stepIndex, steps, navigate, finishTour])

  const handleBack = useCallback(() => {
    if (stepIndex > 0) setStepIndex(i => i - 1)
  }, [stepIndex])

  const startTour = useCallback(() => setPhase('touring'), [])

  const skipTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, 'true')
    setPhase('done')
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === 'done') return null

  if (phase === 'welcome') {
    return <WelcomeModal onStart={startTour} onSkip={skipTour} />
  }

  const step = steps[stepIndex]
  if (!step) return null

  return (
    <>
      <Spotlight rect={targetRect} />
      <TooltipCard
        step={step}
        stepIndex={stepIndex}
        total={steps.length}
        pos={tooltipPos}
        onNext={handleNext}
        onBack={handleBack}
        onExit={exitTour}
      />
    </>
  )
}
