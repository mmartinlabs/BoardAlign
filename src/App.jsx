import React, { useState } from 'react'
import Dashboard from './screens/Dashboard'
import MeetingSetup from './screens/MeetingSetup'
import DefineDecisions from './screens/DefineDecisions'
import SimulateResponses from './screens/SimulateResponses'
import AlignmentReport from './screens/AlignmentReport'
import Archive from './screens/Archive'
import OnboardingTour from './components/OnboardingTour'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [activeMeetingId, setActiveMeetingId] = useState(null)
  const [activeTab, setActiveTab] = useState(null)

  function navigate(screen, meetingId = undefined) {
    setCurrentScreen(screen)
    if (meetingId !== undefined) {
      setActiveMeetingId(meetingId)
    }
    window.scrollTo(0, 0)
  }

  const sharedProps = {
    navigate,
    activeMeetingId,
    activeTab,
    setActiveTab,
  }

  return (
    <>
      {currentScreen === 'dashboard'          && <Dashboard          {...sharedProps} />}
      {currentScreen === 'meeting-setup'      && <MeetingSetup       {...sharedProps} />}
      {currentScreen === 'define-decisions'   && <DefineDecisions    {...sharedProps} />}
      {currentScreen === 'simulate-responses' && <SimulateResponses  {...sharedProps} />}
      {currentScreen === 'alignment-report'   && <AlignmentReport    {...sharedProps} />}
      {currentScreen === 'archive'            && <Archive            {...sharedProps} />}
      <OnboardingTour navigate={navigate} />
    </>
  )
}
