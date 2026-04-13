const STORAGE_KEY = 'boardalign_meetings'

export const DEMO_MEETING_1_ID = 'demo-series-b-q3'
export const DEMO_MEETING_2_ID = 'demo-product-roadmap-q1'

function dateStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function dateStrMonths(offsetMonths) {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  return d.toISOString().split('T')[0]
}

export function seedDemoData() {
  if (localStorage.getItem(STORAGE_KEY)) return

  const m1Members = {
    sarah:  { id: 'dm1-sarah',  name: 'Sarah Chen',     role: 'Managing Director',                    firm: 'Foundry Group' },
    marcus: { id: 'dm1-marcus', name: 'Marcus Webb',     role: 'General Partner',                      firm: 'Benchmark Capital' },
    diana:  { id: 'dm1-diana',  name: 'Diana Osei',      role: 'Independent Director (former COO, Stripe)', firm: '' },
    james:  { id: 'dm1-james',  name: 'James Holloway',  role: 'Partner',                              firm: 'Sequoia Capital' },
  }

  const meeting1 = {
    id: DEMO_MEETING_1_ID,
    name: 'Series B Strategy — Q3 Board Meeting',
    date: dateStr(14),
    status: 'ready',
    createdAt: new Date().toISOString(),
    boardMembers: Object.values(m1Members),
    decisions: [
      {
        id: 'dm1-d1',
        title: 'Expand into European market (DE + FR) by Q1 next year',
        description: 'Committing $2.1M in headcount and infrastructure to open two European offices and localize the product for GDPR compliance and regional payment rails.',
        ceoPosition: 'I believe we should proceed. Our top three enterprise prospects are European, and delaying gives HubSpot another 6 months to consolidate that market.',
        context: 'Current ARR: $8.4M. Projected cost of expansion: $2.1M over 18 months. Pipeline in EU: 3 deals worth $1.2M ARR combined.',
        responses: [
          { boardMemberId: 'dm1-sarah',  stance: 'support',   confidence: 'high',   reasoning: "The pipeline concentration in EU is too strong to ignore. HubSpot's enterprise push makes the timing critical.", changeCondition: '' },
          { boardMemberId: 'dm1-marcus', stance: 'concerned', confidence: 'medium', reasoning: 'We have not yet proven repeatability in our second US market. Expanding internationally before fixing our sales motion in Chicago and Austin feels premature.', changeCondition: 'If we can show Chicago hitting $800K ARR by end of Q3, I would move to support.' },
          { boardMemberId: 'dm1-diana',  stance: 'support',   confidence: 'medium', reasoning: 'From my time at Stripe, EU expansion always feels early until suddenly it feels late. The GDPR compliance work creates a durable moat.', changeCondition: '' },
          { boardMemberId: 'dm1-james',  stance: 'neutral',   confidence: 'low',    reasoning: 'I want to understand the retention numbers in our existing US enterprise accounts before we layer international complexity on the team.', changeCondition: 'Show me NRR above 115% in enterprise for two consecutive quarters.' },
        ],
      },
      {
        id: 'dm1-d2',
        title: 'Promote Elena Vasquez from VP Engineering to CTO',
        description: 'Elevating Elena to CTO with a revised compensation package and board-level reporting. This role did not previously exist at the company.',
        ceoPosition: 'Elena is the clear choice. She has led every major architectural decision for 18 months. The title formalizes what is already true operationally.',
        context: 'Current comp: $210K + 0.8% equity. Proposed: $240K + additional 0.4% option grant. Tenure: 3.5 years. Team size under her: 22 engineers.',
        responses: [
          { boardMemberId: 'dm1-sarah',  stance: 'support', confidence: 'high',   reasoning: 'We have seen Elena operate up close at three board meetings. She is already doing the CTO job.', changeCondition: '' },
          { boardMemberId: 'dm1-marcus', stance: 'support', confidence: 'high',   reasoning: 'No objection. The equity ask is reasonable for the role and tenure.', changeCondition: '' },
          { boardMemberId: 'dm1-diana',  stance: 'support', confidence: 'high',   reasoning: 'Strongly support. Retention risk of not doing this is higher than the cost.', changeCondition: '' },
          { boardMemberId: 'dm1-james',  stance: 'support', confidence: 'medium', reasoning: 'Supportive. Would like to see a 90-day plan for how the engineering org structure changes with her in the CTO seat.', changeCondition: '' },
        ],
      },
      {
        id: 'dm1-d3',
        title: 'Authorize $500K emergency bridge from existing investors',
        description: 'A one-time bridge note from current cap table participants to extend runway by 4 months while Series B closes. Proposed terms: 20% discount, 12-month maturity.',
        ceoPosition: 'I want to avoid this if possible — it sends a signal. But if the Series B timeline slips past October, we have no choice. I am presenting it as a contingency authorization, not a definitive decision.',
        context: 'Current runway: 7 months. Series B lead: term sheet signed, due diligence in progress. Expected close: 10–14 weeks. Worst case scenario adds 6 weeks to timeline.',
        responses: [
          { boardMemberId: 'dm1-sarah',  stance: 'concerned', confidence: 'high',   reasoning: 'The 20% discount is aggressive given we are a week into due diligence. I would push for 15% and a longer maturity.', changeCondition: 'Revise terms to 15% discount, 18-month maturity. Then I support.' },
          { boardMemberId: 'dm1-marcus', stance: 'oppose',    confidence: 'high',   reasoning: 'We should not authorize a bridge before exhausting the timeline optionality. This is a psychological anchor that signals desperation to the Series B lead if it leaks.', changeCondition: 'If Series B due diligence slips past 10 weeks with no term sheet reaffirmation, I would reconsider.' },
          { boardMemberId: 'dm1-diana',  stance: 'neutral',   confidence: 'medium', reasoning: "Operationally I understand the need. But Marcus's point about signaling is correct. Frame it as an internal option, not an authorization.", changeCondition: '' },
          { boardMemberId: 'dm1-james',  stance: 'concerned', confidence: 'medium', reasoning: 'The terms need work. Also, who is leading the note? If it is Foundry and Benchmark, we need to be careful about self-dealing optics.', changeCondition: 'Clarity on who participates and at what pro-rata. Legal review of self-dealing implications.' },
        ],
      },
    ],
  }

  const m2Members = {
    sarah:  { id: 'dm2-sarah',  name: 'Sarah Chen',  role: 'Managing Director',                    firm: 'Foundry Group' },
    marcus: { id: 'dm2-marcus', name: 'Marcus Webb',  role: 'General Partner',                      firm: 'Benchmark Capital' },
    diana:  { id: 'dm2-diana',  name: 'Diana Osei',   role: 'Independent Director (former COO, Stripe)', firm: '' },
  }

  const threeMonthsAgo = dateStrMonths(-3)
  const completedAtDate = new Date(threeMonthsAgo)
  completedAtDate.setDate(completedAtDate.getDate() + 3)

  const meeting2 = {
    id: DEMO_MEETING_2_ID,
    name: 'Product Roadmap Prioritization — Q1 Board Meeting',
    date: threeMonthsAgo,
    status: 'complete',
    createdAt: new Date(threeMonthsAgo).toISOString(),
    completedAt: completedAtDate.toISOString(),
    boardMembers: Object.values(m2Members),
    decisions: [
      {
        id: 'dm2-d1',
        title: 'Deprioritize mobile app in favor of API-first strategy',
        description: 'Shifting 4 engineers from the mobile roadmap to a public API and developer documentation initiative for the next two quarters.',
        ceoPosition: 'Our power users are technical buyers who want to embed our product. The mobile app serves a persona we are not selling to yet.',
        context: 'Mobile DAU: 340. API requests per day from unofficial integrations: 12,000. Three enterprise deals contingent on a documented public API.',
        responses: [
          { boardMemberId: 'dm2-sarah',  stance: 'support',  confidence: 'high',   reasoning: 'The API usage data is conclusive. This is the right call.', changeCondition: '' },
          { boardMemberId: 'dm2-marcus', stance: 'support',  confidence: 'high',   reasoning: 'Agreed. Developer ecosystem is a durable acquisition channel.', changeCondition: '' },
          { boardMemberId: 'dm2-diana',  stance: 'neutral',  confidence: 'medium', reasoning: 'Support the direction but want to ensure mobile is not abandoned — some customers use it for approvals workflows.', changeCondition: '' },
        ],
      },
      {
        id: 'dm2-d2',
        title: 'Increase engineering headcount by 6 in H1',
        description: 'Hiring 4 senior engineers and 2 product managers over the next two quarters to accelerate the API roadmap and support three pending enterprise integrations.',
        ceoPosition: 'We are capacity-constrained. Every delayed integration is a churn risk. We need to hire ahead of the revenue, not behind it.',
        context: 'Current eng team: 18. Open requisitions: 3. Estimated fully-loaded cost of 6 hires: $1.1M annually.',
        responses: [
          { boardMemberId: 'dm2-sarah',  stance: 'support',   confidence: 'medium', reasoning: 'Supportive but want tight hiring criteria. Senior-heavy hiring can slow culture if not managed.', changeCondition: '' },
          { boardMemberId: 'dm2-marcus', stance: 'concerned', confidence: 'medium', reasoning: 'The $1.1M fully-loaded cost against our current burn puts us at 5.5 months runway post-hire. That is too tight heading into a fundraise.', changeCondition: 'If we phase the hiring — 3 in Q1, 3 contingent on Q2 pipeline — I move to support.' },
          { boardMemberId: 'dm2-diana',  stance: 'support',   confidence: 'high',   reasoning: 'Integration delays are the number one reason enterprise customers churn in our category. Hire.', changeCondition: '' },
        ],
      },
    ],
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([meeting1, meeting2]))
}
