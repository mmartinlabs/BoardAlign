const WEIGHTS = { support: 2, neutral: 1, concerned: -1, oppose: -2 }

function getDecisionScore(responses) {
  if (!responses || !responses.length) return null
  const sum = responses.reduce((acc, r) => acc + (WEIGHTS[r.stance] ?? 0), 0)
  const max = responses.length * 2
  const min = responses.length * -2
  return Math.round(((sum - min) / (max - min)) * 100)
}

function getRiskFlag(responses) {
  if (!responses || !responses.length) return 'unknown'
  const score = getDecisionScore(responses)
  const hasOppose = responses.some(r => r.stance === 'oppose')
  if (score === null) return 'unknown'
  if (score < 40 || hasOppose) return 'red'
  if (score < 70 || responses.some(r => r.stance === 'concerned')) return 'yellow'
  return 'green'
}

function getSuggestedTime(responses) {
  const flag = getRiskFlag(responses)
  return flag === 'green' ? 10 : flag === 'yellow' ? 20 : 35
}

function getKeyObjectors(decision, boardMembers) {
  const opposed = decision.responses
    .filter(r => r.stance === 'oppose')
    .map(r => ({ ...r, member: boardMembers.find(m => m.id === r.boardMemberId) }))
  const concerned = decision.responses
    .filter(r => r.stance === 'concerned')
    .map(r => ({ ...r, member: boardMembers.find(m => m.id === r.boardMemberId) }))
  return [...opposed, ...concerned]
}

function getMeetingStatus(meeting) {
  if (!meeting.decisions || !meeting.decisions.length) return 'unknown'
  const responsesExist = meeting.decisions.some(d => d.responses && d.responses.length > 0)
  if (!responsesExist) return 'unknown'
  const flags = meeting.decisions.map(d => getRiskFlag(d.responses))
  if (flags.includes('red')) return 'at-risk'
  if (flags.includes('yellow')) return 'mixed'
  return 'aligned'
}

function getMemberRiskProfile(memberId, decisions) {
  if (!decisions || !decisions.length) return { negativeCount: 0, flagged: false }
  const negativeCount = decisions.filter(d =>
    d.responses && d.responses.some(r => r.boardMemberId === memberId && ['concerned', 'oppose'].includes(r.stance))
  ).length
  return {
    negativeCount,
    flagged: decisions.length > 0 && negativeCount > decisions.length / 2
  }
}

export {
  getDecisionScore,
  getRiskFlag,
  getSuggestedTime,
  getKeyObjectors,
  getMeetingStatus,
  getMemberRiskProfile
}
