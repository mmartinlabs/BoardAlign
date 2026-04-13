import React from 'react'
import StanceSelector from './StanceSelector'
import ConfidenceSelector from './ConfidenceSelector'
import StanceBar from './StanceBar'
import RiskBadge from './RiskBadge'
import TextArea from './TextArea'
import { getDecisionScore, getRiskFlag, getKeyObjectors } from '../utils/scoringLogic'
import { truncate } from '../utils/helpers'

export default function DecisionCard({
  mode,
  decision,
  response,
  onResponseChange,
  boardMembers,
  cardTourTarget,
  objectorsTourTarget,
}) {
  if (mode === 'entry') {
    return <EntryCard decision={decision} response={response} onResponseChange={onResponseChange} />
  }
  return (
    <ReportCard
      decision={decision}
      boardMembers={boardMembers}
      cardTourTarget={cardTourTarget}
      objectorsTourTarget={objectorsTourTarget}
    />
  )
}

function EntryCard({ decision, response = {}, onResponseChange }) {
  const { title, description, ceoPosition } = decision
  const stance = response.stance || ''
  const confidence = response.confidence || ''
  const reasoning = response.reasoning || ''
  const changeCondition = response.changeCondition || ''

  return (
    <div className="response-card">
      <div className="response-card-context">
        <div className="response-card-title">{title}</div>
        {description && (
          <div className="response-card-desc">{description}</div>
        )}
        {ceoPosition && (
          <span className="ceo-position-pill">
            Your position: {truncate(ceoPosition, 80)}
          </span>
        )}
      </div>
      <div className="response-card-fields">
        <div className="response-field-section">
          <div className="response-field-label">Stance</div>
          <StanceSelector value={stance} onChange={val => onResponseChange('stance', val)} />
        </div>
        <ConfidenceSelector value={confidence} onChange={val => onResponseChange('confidence', val)} />
        <TextArea
          label="What is the core reason behind their stance?"
          value={reasoning}
          onChange={e => onResponseChange('reasoning', e.target.value)}
          placeholder="e.g. Concerned about burn rate implications given current runway."
          rows={2}
        />
        <div>
          <TextArea
            label="What would change their view?"
            value={changeCondition}
            onChange={e => onResponseChange('changeCondition', e.target.value)}
            placeholder="e.g. Evidence that the partnership reduces CAC by >20%."
            rows={2}
          />
          <p className="helper-text">
            A board member who can articulate a change condition is engaging as a thinking partner. One who cannot is a vote, not a mentor.
          </p>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ decision, boardMembers, cardTourTarget, objectorsTourTarget }) {
  const { title, ceoPosition, responses = [] } = decision
  const score = getDecisionScore(responses)
  const flag = getRiskFlag(responses)
  const objectors = getKeyObjectors(decision, boardMembers)

  return (
    <div className="decision-report-card" data-tour={cardTourTarget}>
      <div className="decision-report-header">
        <div className="decision-report-title">{title}</div>
        <RiskBadge flag={flag} />
      </div>
      <StanceBar responses={responses} />
      {score !== null && (
        <div className="decision-report-score">Alignment score: {score}/100</div>
      )}
      {ceoPosition && (
        <div className="decision-ceo-position">Your position: {ceoPosition}</div>
      )}
      {objectors.length > 0 && (
        <div className="key-objectors" data-tour={objectorsTourTarget}>
          <div className="key-objectors-label">Requires attention</div>
          {objectors.map((objector, idx) => (
            <div key={idx} className="objector-row">
              <div className="objector-name-line">
                <span>{objector.member?.name || 'Unknown'}</span>
                <RiskBadge flag={objector.stance === 'oppose' ? 'red' : 'yellow'} />
              </div>
              {objector.reasoning && (
                <div className="objector-detail">Reasoning: {objector.reasoning}</div>
              )}
              {objector.changeCondition ? (
                <div className="objector-detail">
                  Change condition:
                  <span className="change-condition-pill">{objector.changeCondition}</span>
                </div>
              ) : (
                <div className="no-change-condition">
                  No change condition specified — approach with open-ended questioning.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
