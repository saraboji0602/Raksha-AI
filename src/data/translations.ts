export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    appName: 'RAKSHA-AI',
    appSubtitle: 'AI-Powered Settlement Resilience & Relocation Intelligence',
    tagline: 'From Risk Maps to Actionable Relocation Decisions',
    demoBadge: 'SYNTHETIC DEMO ENVIRONMENT',
    officialPortal: 'Disaster Decision Support System',
    
    // View Switcher
    officerPortal: 'Officer Command Center',
    citizenPortal: 'Citizen Safety Portal',
    switchMode: 'Switch Mode',
    
    // Navigation
    navOverview: 'Overview',
    navRiskMap: 'Risk Intelligence (GIS)',
    navSettlements: 'Vulnerable Habitations',
    navIntervention: 'Intervention Engine',
    navSafeSites: 'Safe Relocation Sites',
    navRelocationPlanner: 'Relocation Planner',
    navSimulator: 'Scenario Simulator',
    navPrevention: 'Disaster Prevention Engine',
    navFieldVerification: 'Field Verification',
    navReports: 'Decision Reports',
    navAlerts: 'Alerts & Escalations',
    navEmergencyCenter: 'Officer Emergency Center',
    navAudit: 'Audit Trail & Governance',
    navRecovery: 'Recovery & Reconstruction',
    navDataSources: 'Data Sources & Quality',
    navSettings: 'System Settings',
    navHelp: 'Help & Methodology',

    // Group Navigation Headers
    navGroupMonitor: 'MONITOR & INTELLIGENCE',
    navGroupAct: 'ACT & RESPOND',
    navGroupPlan: 'PLAN & RELOCATE',
    navGroupVerify: 'VERIFY & RECOVER',
    navGroupInsight: 'INSIGHTS & GOVERNANCE',
    decisionBriefBtn: 'Judge Decision Brief',
    resetDemoBtn: 'Reset Demo Baseline',
    
    // Citizen Navigation
    citizenNavHome: 'Citizen Safety Home',
    citizenNavAlerts: 'Live Alerts & Warnings',
    citizenNavSOS: 'Emergency SOS & Help',
    citizenNavShelters: 'Find Safe Shelter',
    citizenNavRoutes: 'Safe Route & Road Status',
    citizenNavReport: 'Report Hazard / Damage',
    citizenNavStatus: 'My Reports & SOS Status',
    citizenNavHelp: '24x7 Helplines & First Aid',
    
    // Core Decision Terms
    protect: 'PROTECT',
    adapt: 'ADAPT',
    partialRelocation: 'PARTIAL RELOCATION',
    fullRelocation: 'FULL RELOCATION',
    doNothing: 'DO NOTHING',
    
    // Risk Levels
    critical: 'CRITICAL',
    veryHigh: 'VERY HIGH',
    high: 'HIGH',
    moderate: 'MODERATE',
    low: 'LOW',
    
    // Priority
    immediate: 'IMMEDIATE',
    shortTerm: 'SHORT-TERM',
    mediumTerm: 'MEDIUM-TERM',
    monitor: 'MONITOR',
    
    // Citizen Home & Risk
    whereAmI: 'Where Am I?',
    currentSafetyStatus: 'Current Safety Status',
    whatShouldIDoNow: 'What Should I Do Now?',
    whyRiskExplanation: 'Why is my area at risk?',
    nearestSafeShelter: 'Nearest Safe Shelter',
    safeRouteStatus: 'Safe Evacuation Route',
    emergencyHelpQuick: 'Emergency Help & Helplines',
    reportHazardQuick: 'Report Hazard in Your Area',
    sendSOSQuick: 'SEND EMERGENCY SOS',
    citizenWelcome: 'Welcome, Citizen',
    citizenLocation: 'Your Registered Habitation',
    citizenStatusBanner: 'Habitation Risk & Advisory Status',
    safeShelterNotice: 'Official Safe Shelters in your sector are operating.',
    evacuationNotice: 'Evacuation advisory active. Follow designated green corridors.',
    
    // Action Card Decisions
    actionStayAlert: 'STAY ALERT & MONITOR UPDATES',
    actionPrepareToMove: 'PREPARE TO MOVE TO HIGHER GROUND',
    actionEvacuateNow: 'EVACUATE IMMEDIATELY TO DESIGNATED HAVEN',
    actionAvoidBlockedRoad: 'AVOID COASTAL CAUSEWAY (ROAD SUBMERGED)',
    actionRequestHelp: 'REQUEST EMERGENCY EVACUATION SUPPORT',
    
    // Personalized Alerts
    alertFlood: 'Estuarine Flood & Tidal Surge Warning',
    alertCyclone: 'Cyclonic Gale Wind Warning',
    alertRoadBlocked: 'Evacuation Route Blockage Notice',
    alertShelterCapacity: 'Shelter Capacity Alert',
    alertEvacuate: 'Preemptive Evacuation Advisory',
    whyQuestion: 'WHY THIS ALERT?',
    whatShouldIDoQuestion: 'WHAT SHOULD I DO?',
    whereShouldIGoQuestion: 'WHERE SHOULD I GO?',
    
    // SOS System
    sosTitle: 'Emergency Distress Beacon (SOS)',
    sosSubtitle: 'Directly alerts District Disaster Control Room (DDMA) & NDRF',
    sosTypeLabel: 'Nature of Emergency',
    sosPeopleLabel: 'Total Persons Requiring Assistance',
    sosVulnerableLabel: 'Vulnerable Family Members Present',
    sosElderly: 'Elderly (Age 65+)',
    sosInfants: 'Infants & Young Children',
    sosDisabled: 'Persons with Disabilities',
    sosMedical: 'Critical Medical / Oxygen Need',
    sosPregnant: 'Pregnant Mothers',
    sosTransmitBtn: 'TRANSMIT RESCUE SOS NOW',
    sosTransmittedTitle: 'SOS Transmitted to Command Desk',
    sosPriorityAssigned: 'Priority Score Assigned',
    sosStatusSubmitted: 'SOS Packet Submitted',
    sosStatusReceived: 'Received by DDMA Emergency Desk',
    sosStatusAssigned: 'Rescue Unit Dispatched',
    sosStatusEnRoute: 'En Route to Your GPS Location',
    sosStatusResolved: 'Rescue Completed / Safe',
    
    // Shelters & Capacities
    shelterAvailableHeadroom: 'Available Headroom',
    shelterCurrentOccupancy: 'Current Occupancy',
    shelterStatusOpen: 'OPEN & ACCEPTING RESIDENTS',
    shelterStatusNearCapacity: 'NEAR CAPACITY (Limited Space)',
    shelterStatusFull: 'FULL (Redirecting to Alternative)',
    amenityWater: 'Potable Drinking Water',
    amenityMedical: 'Medical Post & First Aid',
    amenityElectricity: 'Generator Power & Lighting',
    amenitySanitation: 'Sanitation & Hygiene Blocks',
    amenityWheelchair: 'Wheelchair / Stretcher Accessible',
    
    // Routes
    routeStatusSafe: 'OPEN & ALL-WEATHER SAFE',
    routeStatusBlocked: 'BLOCKED DUE TO INUNDATION',
    routeRerouteNotice: 'Route updated because Coastal Causeway is flooded.',
    
    // Hazard Reporting
    reportHazardTitle: 'Report Ground Hazard or Infrastructure Damage',
    reportTypeSelect: 'Hazard Category',
    reportSeveritySelect: 'Hazard Severity',
    reportDescriptionPlaceholder: 'Describe the blockage, water depth, or danger...',
    reportSubmitBtn: 'Submit Ground Hazard Report',
    reportStatusSubmitted: 'Submitted',
    reportStatusReceived: 'Received by Control Desk',
    reportStatusUnderReview: 'Under Review',
    reportStatusVerified: 'Verified by Field Officer',
    reportStatusResolved: 'Resolved / Mitigated',
    
    // Officer Emergency Center
    officerEmergencyTitle: 'Officer Emergency Command Center',
    officerEmergencySubtitle: 'Real-Time Multi-Hazard Incident Management & Resource Dispatch',
    liveSOSQueue: 'Live Citizen SOS Queue',
    activeIncidents: 'Active Incidents & Hazards',
    priorityScoreLabel: 'Deterministic Priority',
    dispatchResource: 'Dispatch Emergency Resource',
    assignTeamBtn: 'Assign Unit',
    timelineStage: 'Incident Lifecycle Timeline',
    shelterMonitor: 'District Shelter Capacity & Headroom',
    roadNetworkMonitor: 'Evacuation Corridor Network Status',
    
    // Phase 3: Field Tasks & Conflict
    fieldTasksTitle: 'Ground Truth Verification Tasks',
    fieldTasksSubtitle: 'Assigned inspection tasks for field survey teams',
    taskPending: 'Pending Verification',
    taskInProgress: 'In Progress',
    taskCompleted: 'Completed',
    dataConflictDetected: 'Data Conflict Detected',
    aiSensorModel: 'AI / Remote Sensor Stream',
    fieldEvidence: 'Physical Field Inspection',
    acceptFieldEvidence: 'Accept Field Evidence (High Confidence)',
    retainAiModel: 'Retain AI Satellite Model',
    conflictResolvedBadge: 'Conflict Resolved by Human Authority',
    
    // Phase 3: Audit Trail & Governance
    auditTrailTitle: 'Explainable Audit Trail & Governance Ledger',
    auditTrailSubtitle: 'Immutable human-in-the-loop decision log and statutory relocation checklist',
    filterByActor: 'Filter by Actor',
    filterBySettlement: 'Filter by Settlement',
    statutoryChecklistTitle: 'Statutory Administrative Relocation Review',
    statutoryChecklistSubtitle: 'Mandatory cross-departmental clearances required before final gazette notification',
    
    // Phase 3: Recovery Center
    recoveryTitle: 'Post-Disaster Recovery & Reconstruction Center',
    recoverySubtitle: 'Deterministic recovery prioritization, damage assessment, and infrastructure rebuild tracking',
    totalEstimatedDamage: 'Total Estimated Damage',
    recoveryBudgetAllocated: 'Budget Allocated',
    recoveryProjectsActive: 'Active Rebuild Projects',
    recoveryPriorityRank: 'Deterministic Recovery Priority',
    updateMilestone: 'Update Milestone / Progress',
    recordCitizenClaim: 'Record Citizen Damage Assessment',

    // Labels
    riskScore: 'Risk Score',
    exposureScore: 'Exposure Score',
    vulnerabilityScore: 'Vulnerability Score',
    resilienceScore: 'Resilience Score',
    dataConfidence: 'Data Confidence',
    population: 'Population',
    households: 'Households',
    costOfInaction: 'Cost of Inaction',
    carryingCapacity: 'Carrying Capacity',
    communityAcceptance: 'Community Acceptance',
    emergencyMode: 'EMERGENCY OPERATIONS MODE'
  },
  
  ta: {
    appName: 'ரக்ஷா-AI (RAKSHA-AI)',
    appSubtitle: 'செயற்கை நுண்ணறிவு அடிப்படையிலான பேரிடர் பாதுகாப்பு மற்றும் மீள்குடியேற்ற தளம்',
    tagline: 'ஆபத்து வரைபடங்களிலிருந்து பாதுகாப்பான மீள்குடியேற்ற முடிவுகள் வரை',
    demoBadge: 'மாதிரி செயல்விளக்க சூழல்',
    officialPortal: 'பேரிடர் மேலாண்மை முடிவு ஆதரவு தளம்',
    
    // View Switcher
    officerPortal: 'அதிகாரிகள் கட்டுப்பாட்டு மையம்',
    citizenPortal: 'பொதுமக்கள் பாதுகாப்பு தளம்',
    switchMode: 'தளத்தை மாற்றுக',
    
    // Navigation
    navOverview: 'பொதுப் பார்வை (Overview)',
    navRiskMap: 'பேரிடர் வரைபடம் (GIS)',
    navSettlements: 'பாதிக்கப்படக்கூடிய குடியிருப்புகள்',
    navIntervention: 'தலையீட்டு இயந்திரம் (Intervention)',
    navSafeSites: 'பாதுகாப்பான இடங்கள் (Safe Sites)',
    navRelocationPlanner: 'மீள்குடியேற்ற திட்டமிடல்',
    navSimulator: 'சூழ்நிலை உருவகப்படுத்துதல்',
    navPrevention: 'பேரிடர் தடுப்பு இயந்திரம்',
    navFieldVerification: 'கள சரிபார்ப்பு (Field Verification)',
    navReports: 'முடிவு அறிக்கைகள்',
    navAlerts: 'எச்சரிக்கைகள் & தீவிரப்படுத்தல்',
    navEmergencyCenter: 'அதிகாரிகள் அவசரகால மையம்',
    navAudit: 'தணிக்கை & சட்டப்பூர்வ ஒப்புதல்கள்',
    navRecovery: 'பேரழிவுக்குப் பிந்தைய மீட்பு',
    navDataSources: 'தரவு மூலங்கள் & தரம்',
    navSettings: 'கணினி அமைப்புகள்',
    navHelp: 'உதவி & வழிமுறைகள்',

    // Group Navigation Headers
    navGroupMonitor: 'கண்காணிப்பு & நுண்ணறிவு',
    navGroupAct: 'செயல்படு & பதிலளி',
    navGroupPlan: 'திட்டமிடு & மீள்குடியேற்று',
    navGroupVerify: 'சரிபார் & மீட்டெடு',
    navGroupInsight: 'அறிக்கைகள் & ஆளுகை',
    decisionBriefBtn: 'நீதிபதி முடிவு சுருக்கம்',
    resetDemoBtn: 'மாதிரியை மீட்டமை',
    
    // Citizen Navigation
    citizenNavHome: 'பொதுமக்கள் பாதுகாப்பு முகப்பு',
    citizenNavAlerts: 'நேரலை எச்சரிக்கைகள்',
    citizenNavSOS: 'அவசர SOS உதவி',
    citizenNavShelters: 'பாதுகாப்பான புகலிடங்கள்',
    citizenNavRoutes: 'பாதுகாப்பான பாதைகள் & சாலை நிலை',
    citizenNavReport: 'ஆபத்து / சேதம் புகாரளிப்பு',
    citizenNavStatus: 'என் புகார்கள் & SOS நிலை',
    citizenNavHelp: '24x7 அவசர எண்கள் & முதலுதவி',
    
    // Core Decision Terms
    protect: 'பாதுகாப்பு (PROTECT)',
    adapt: 'தகவமைப்பு (ADAPT)',
    partialRelocation: 'பகுதி மீள்குடியேற்றம்',
    fullRelocation: 'முழு மீள்குடியேற்றம்',
    doNothing: 'செயலின்மை (DO NOTHING)',
    
    // Risk Levels
    critical: 'மிக ஆபத்தானது',
    veryHigh: 'மிக அதிகம்',
    high: 'அதிகம்',
    moderate: 'மிதமானது',
    low: 'குறைவானது',
    
    // Priority
    immediate: 'உடனடி',
    shortTerm: 'குறுகிய கால',
    mediumTerm: 'நடுத்தர கால',
    monitor: 'கண்காணிப்பு',
    
    // Citizen Home & Risk
    whereAmI: 'நான் எங்கே இருக்கிறேன்?',
    currentSafetyStatus: 'தற்போதைய பாதுகாப்பு நிலை',
    whatShouldIDoNow: 'இப்போது நான் என்ன செய்ய வேண்டும்?',
    whyRiskExplanation: 'எனது பகுதி ஏன் ஆபத்தில் உள்ளது?',
    nearestSafeShelter: 'அருகிலுள்ள பாதுகாப்பான புகலிடம்',
    safeRouteStatus: 'பாதுகாப்பான வெளியேறும் பாதை',
    emergencyHelpQuick: 'அவசர உதவி எண்கள்',
    reportHazardQuick: 'ஆபத்துகளைப் புகாரளிக்கவும்',
    sendSOSQuick: 'அவசர உதவி கோரிக்கை (SOS)',
    citizenWelcome: 'வணக்கம், குடிமக்களே',
    citizenLocation: 'உங்கள் பதிவுசெய்யப்பட்ட குடியிருப்பு',
    citizenStatusBanner: 'குடியிருப்பு ஆபத்து நிலை & ஆலோசனை',
    safeShelterNotice: 'உங்கள் பகுதிக்கான அதிகாரப்பூர்வ புகலிடங்கள் செயல்படுகின்றன.',
    evacuationNotice: 'வெளியேற்ற ஆலோசனை நடைமுறையில் உள்ளது. பச்சை பாதைகளைப் பின்பற்றவும்.',
    
    // Action Card Decisions
    actionStayAlert: 'விழிப்புடன் இருங்கள் மற்றும் எச்சரிக்கைகளைக் கவனியுங்கள்',
    actionPrepareToMove: 'மேடான பாதுகாப்பான இடத்திற்கு செல்லத் தயாராகுங்கள்',
    actionEvacuateNow: 'உடனடியாக ஒதுக்கப்பட்ட பாதுகாப்பான இடத்திற்கு வெளியேறுங்கள்',
    actionAvoidBlockedRoad: 'கடற்கரை தரைப்பாலத்தை தவிர்க்கவும் (வெள்ளம் சூழ்ந்துள்ளது)',
    actionRequestHelp: 'அவசர மீட்பு உதவியைக் கோருங்கள்',
    
    // Personalized Alerts
    alertFlood: 'வெள்ளப் பெருக்கு அபாய எச்சரிக்கை',
    alertCyclone: 'சூறாவளி காற்று எச்சரிக்கை',
    alertRoadBlocked: 'வெளியேறும் சாலையில் வெள்ள அடைப்பு',
    alertShelterCapacity: 'புகலிட இடவசதி எச்சரிக்கை',
    alertEvacuate: 'முன்னெச்சரிக்கை வெளியேற்ற ஆலோசனை',
    whyQuestion: 'இந்த எச்சரிக்கை ஏன்?',
    whatShouldIDoQuestion: 'நான் என்ன உடனடி நடவடிக்கை எடுக்க வேண்டும்?',
    whereShouldIGoQuestion: 'நான் எங்கு செல்ல வேண்டும்?',
    
    // SOS System
    sosTitle: 'அவசர ஆபத்து சமிக்ஞை (SOS)',
    sosSubtitle: 'மாவட்ட பேரிடர் மேலாண்மை ஆணையத்திற்கு (DDMA) நேரடியாக அறிவிக்கிறது',
    sosTypeLabel: 'அவசர வகை',
    sosPeopleLabel: 'மீட்கப்பட வேண்டிய மொத்த நபர்கள்',
    sosVulnerableLabel: 'பாதிக்கப்படக்கூடிய குடும்ப உறுப்பினர்கள்',
    sosElderly: 'முதியவர்கள் (65+ வயது)',
    sosInfants: 'குழந்தைகள்',
    sosDisabled: 'மாற்றுத்திறனாளிகள்',
    sosMedical: 'மருத்துவ / ஆக்சிஜன் தேவை',
    sosPregnant: 'கர்ப்பிணிப் பெண்கள்',
    sosTransmitBtn: 'அவசர SOS-ஐ உடனே அனுப்புக',
    sosTransmittedTitle: 'SOS சமிக்ஞை அனுப்பப்பட்டது',
    sosPriorityAssigned: 'முன்னுரிமை மதிப்பீடு நிர்ணயிக்கப்பட்டது',
    sosStatusSubmitted: 'SOS சமர்ப்பிக்கப்பட்டது',
    sosStatusReceived: 'கட்டுப்பாட்டு மையம் பெற்றது',
    sosStatusAssigned: 'மீட்புக் குழு நியமிக்கப்பட்டது',
    sosStatusEnRoute: 'மீட்புக் குழு உங்கள் இடத்தை நோக்கி வருகிறது',
    sosStatusResolved: 'மீட்புப் பணி முடிந்தது / பாதுகாப்பானது',
    
    // Shelters & Capacities
    shelterAvailableHeadroom: 'இருக்கக்கூடிய மீதி இடங்கள்',
    shelterCurrentOccupancy: 'தற்போது தங்கியுள்ள நபர்கள்',
    shelterStatusOpen: 'திறந்துள்ளது (இடவசதி உள்ளது)',
    shelterStatusNearCapacity: 'கிட்டத்தட்ட நிரம்பியுள்ளது',
    shelterStatusFull: 'முழுமையாக நிரம்பியது (மாற்று இடத்திற்குச் செல்லவும்)',
    amenityWater: 'குடிநீர் வசதி',
    amenityMedical: 'மருத்துவ & முதலுதவி வசதி',
    amenityElectricity: 'மின்சாரம் & ஜெனரேட்டர்',
    amenitySanitation: 'சுகாதார கழிப்பறைகள்',
    amenityWheelchair: 'சக்கர நாற்காலி அணுகல்',
    
    // Routes
    routeStatusSafe: 'பாதுகாப்பானது & திறந்துள்ளது',
    routeStatusBlocked: 'வெள்ள நீரால் மூடப்பட்டுள்ளது',
    routeRerouteNotice: 'கடற்கரை தரைப்பாலம் நீரில் மூழ்கியதால் பாதை மாற்றப்பட்டுள்ளது.',
    
    // Hazard Reporting
    reportHazardTitle: 'ஆபத்து அல்லது சேதத்தை புகாரளிக்கவும்',
    reportTypeSelect: 'ஆபத்து வகை',
    reportSeveritySelect: 'தீவிரத்தன்மை',
    reportDescriptionPlaceholder: 'நீர் ஆழம், மின்கம்பி அறுந்துள்ளதா அல்லது ஆபத்து பற்றி விவரிக்கவும்...',
    reportSubmitBtn: 'ஆபத்து அறிக்கையைச் சமர்ப்பிக்கவும்',
    reportStatusSubmitted: 'சமர்ப்பிக்கப்பட்டது',
    reportStatusReceived: 'கட்டுப்பாட்டு மையம் பெற்றது',
    reportStatusUnderReview: 'ஆய்வில் உள்ளது',
    reportStatusVerified: 'கள அதிகாரியால் சரிபார்க்கப்பட்டது',
    reportStatusResolved: 'சரிசெய்யப்பட்டது',
    
    // Officer Emergency Center
    officerEmergencyTitle: 'அதிகாரிகள் அவசரகால கட்டுப்பாட்டு மையம்',
    officerEmergencySubtitle: 'நேரலை பேரிடர் மேலாண்மை மற்றும் மீட்புப் படைகள் ஒதுக்கீடு',
    liveSOSQueue: 'நேரலை பொதுமக்கள் SOS வரிசை',
    activeIncidents: 'செயலில் உள்ள சம்பவங்கள்',
    priorityScoreLabel: 'முன்னுரிமை மதிப்பீடு',
    dispatchResource: 'மீட்புப் படையை அனுப்புக',
    assignTeamBtn: 'படையை நியமிக்க',
    timelineStage: 'சம்பவ முன்னேற்ற காலவரிசை',
    shelterMonitor: 'மாவட்ட புகலிட இடவசதி கண்காணிப்பு',
    roadNetworkMonitor: 'வெளியேறும் பாதை நெட்வொர்க் நிலை',
    
    // Phase 3: Field Tasks & Conflict
    fieldTasksTitle: 'கள உண்மை சரிபார்ப்பு பணிகள்',
    fieldTasksSubtitle: 'கள ஆய்வு குழுக்களுக்கு ஒதுக்கப்பட்ட ஆய்வு பணிகள்',
    taskPending: 'சரிபார்ப்பு நிலுவையில் உள்ளது',
    taskInProgress: 'நடந்து கொண்டிருக்கிறது',
    taskCompleted: 'முடிக்கப்பட்டது',
    dataConflictDetected: 'தரவு முரண்பாடு கண்டறியப்பட்டது',
    aiSensorModel: 'AI / செயற்கைக்கோள் சென்சார் ஸ்ட்ரீம்',
    fieldEvidence: 'நேரடி கள ஆய்வு சான்று',
    acceptFieldEvidence: 'கள சான்றை ஏற்றுக்கொள் (உயர் நம்பிக்கை)',
    retainAiModel: 'AI மாதிரியைத் தக்கவைக்கவும்',
    conflictResolvedBadge: 'அதிகாரியால் முரண்பாடு தீர்க்கப்பட்டது',
    
    // Phase 3: Audit Trail & Governance
    auditTrailTitle: 'விளக்கக்கூடிய தணிக்கை & ஆளுகை பதிவு',
    auditTrailSubtitle: 'மாற்ற முடியாத மனித முடிவுகள் மற்றும் சட்டரீதியான மீள்குடியேற்ற சரிபார்ப்புப் பட்டியல்',
    filterByActor: 'செயலாளர் மூலம் வடிகட்டுக',
    filterBySettlement: 'குடியிருப்பு மூலம் வடிகட்டுக',
    statutoryChecklistTitle: 'சட்டரீதியான நிர்வாக மீள்குடியேற்ற ஆய்வு',
    statutoryChecklistSubtitle: 'அரசாணை வெளியிடுவதற்கு முன் கட்டாயமாகப் பெற வேண்டிய அனுமதிகள்',
    
    // Phase 3: Recovery Center
    recoveryTitle: 'பேரழிவுக்குப் பிந்தைய மீட்பு & புனரமைப்பு மையம்',
    recoverySubtitle: 'மீட்பு முன்னுரிமை கணக்கீடு, சேத மதிப்பீடு மற்றும் உள்கட்டமைப்பு புனரமைப்பு கண்காணிப்பு',
    totalEstimatedDamage: 'மதிப்பிடப்பட்ட மொத்த சேதம்',
    recoveryBudgetAllocated: 'ஒதுக்கப்பட்ட நிதி',
    recoveryProjectsActive: 'செயலில் உள்ள புனரமைப்பு திட்டங்கள்',
    recoveryPriorityRank: 'மீட்பு முன்னுரிமை மதிப்பீடு',
    updateMilestone: 'மைல்கல் / முன்னேற்றத்தைப் புதுப்பிக்கவும்',
    recordCitizenClaim: 'குடிமக்கள் சேதக் கோரிக்கையைப் பதிவு செய்க',

    // Labels
    riskScore: 'ஆபத்து மதிப்பீடு',
    exposureScore: 'பாதிப்பு வெளிப்பாடு',
    vulnerabilityScore: 'பாதிக்கப்படக்கூடிய தன்மை',
    resilienceScore: 'மீள்திறன் மதிப்பீடு',
    dataConfidence: 'தரவு நம்பகத்தன்மை',
    population: 'மக்கள் தொகை',
    households: 'குடும்பங்கள்',
    costOfInaction: 'செயலின்மைக்கான இழப்பு',
    carryingCapacity: 'தாங்கும் திறன் (Capacity)',
    communityAcceptance: 'சமூக ஏற்புத்திறன்',
    emergencyMode: 'அவசரகால இயக்க நிலை'
  },
  
  hi: {
    appName: 'रक्षा-AI (RAKSHA-AI)',
    appSubtitle: 'एआई-संचालित बस्ती लचीलापन एवं पुनर्वास निर्णय मंच',
    tagline: 'जोखिम मानचित्रों से सुरक्षित पुनर्वास निर्णयों तक',
    demoBadge: 'सिंथेटिक डेमो वातावरण',
    officialPortal: 'आपदा निर्णय समर्थन प्रणाली',
    
    // View Switcher
    officerPortal: 'अधिकारी कमांड सेंटर',
    citizenPortal: 'नागरिक सुरक्षा पोर्टल',
    switchMode: 'मोड बदलें',
    
    // Navigation
    navOverview: 'अवलोकन (Overview)',
    navRiskMap: 'जोखिम मानचित्र (GIS)',
    navSettlements: 'संवेदनशील बस्तियां',
    navIntervention: 'हस्तक्षेप इंजन (Intervention)',
    navSafeSites: 'सुरक्षित पुनर्वास स्थल',
    navRelocationPlanner: 'पुनर्वास योजना',
    navSimulator: 'परिदृश्य सिम्युलेटर (Simulator)',
    navPrevention: 'आपदा रोकथाम इंजन',
    navFieldVerification: 'फील्ड सत्यापन (Field Verification)',
    navReports: 'निर्णय रिपोर्ट (Reports)',
    navAlerts: 'अलर्ट एवं चेतावनियां',
    navEmergencyCenter: 'अधिकारी आपातकालीन केंद्र',
    navAudit: 'ऑडिट ट्रेल एवं शासन',
    navRecovery: 'आपदा उपरांत पुनर्प्राप्ति',
    navDataSources: 'डेटा स्रोत और गुणवत्ता',
    navSettings: 'प्रणाली सेटिंग्स',
    navHelp: 'सहायता एवं कार्यप्रणाली',

    // Group Navigation Headers
    navGroupMonitor: 'निगरानी एवं बुद्धिमत्ता',
    navGroupAct: 'कार्यवाही एवं प्रतिक्रिया',
    navGroupPlan: 'योजना एवं पुनर्वास',
    navGroupVerify: 'सत्यापन एवं पुनर्प्राप्ति',
    navGroupInsight: 'रिपोर्ट एवं शासन',
    decisionBriefBtn: 'जज निर्णय संक्षिप्त',
    resetDemoBtn: 'डेमो रीसेट करें',
    
    // Citizen Navigation
    citizenNavHome: 'नागरिक सुरक्षा होम',
    citizenNavAlerts: 'लाइव अलर्ट एवं चेतावनियां',
    citizenNavSOS: 'आपातकालीन सहायता (SOS)',
    citizenNavShelters: 'सुरक्षित आश्रय खोजें',
    citizenNavRoutes: 'सुरक्षित मार्ग एवं सड़क स्थिति',
    citizenNavReport: 'खतरे / क्षति की रिपोर्ट करें',
    citizenNavStatus: 'मेरी रिपोर्ट एवं SOS स्थिति',
    citizenNavHelp: '24x7 हेल्पलाइन एवं प्राथमिक उपचार',
    
    // Core Decision Terms
    protect: 'सुरक्षित करें (PROTECT)',
    adapt: 'अनुकूलन (ADAPT)',
    partialRelocation: 'आंशिक पुनर्वास (PARTIAL RELOCATION)',
    fullRelocation: 'पूर्ण पुनर्वास (FULL RELOCATION)',
    doNothing: 'कुछ न करें (DO NOTHING)',
    
    // Risk Levels
    critical: 'अति संवेदनशील (CRITICAL)',
    veryHigh: 'बहुत उच्च जोखिम',
    high: 'उच्च जोखिम',
    moderate: 'मध्यम जोखिम',
    low: 'निम्न जोखिम',
    
    // Priority
    immediate: 'तत्काल आवश्यक (IMMEDIATE)',
    shortTerm: 'अल्पकालिक',
    mediumTerm: 'मध्यमकालिक',
    monitor: 'निगरानी (MONITOR)',
    
    // Citizen Home & Risk
    whereAmI: 'मैं कहाँ हूँ?',
    currentSafetyStatus: 'वर्तमान सुरक्षा स्थिति',
    whatShouldIDoNow: 'मुझे अब क्या करना चाहिए?',
    whyRiskExplanation: 'मेरा क्षेत्र जोखिम में क्यों है?',
    nearestSafeShelter: 'निकटतम सुरक्षित आश्रय',
    safeRouteStatus: 'सुरक्षित निकासी मार्ग',
    emergencyHelpQuick: 'आपातकालीन हेल्पलाइन',
    reportHazardQuick: 'खतरे की सूचना दें',
    sendSOSQuick: 'आपातकालीन SOS भेजें',
    citizenWelcome: 'स्वागत है, नागरिक',
    citizenLocation: 'आपकी पंजीकृत बस्ती',
    citizenStatusBanner: 'बस्ती जोखिम एवं परामर्श स्थिति',
    safeShelterNotice: 'आपके क्षेत्र के आधिकारिक राहत आश्रय चालू हैं।',
    evacuationNotice: 'निकासी परामर्श सक्रिय है। निर्दिष्ट हरे गलियारों का पालन करें।',
    
    // Action Card Decisions
    actionStayAlert: 'सतर्क रहें और अलर्ट की निगरानी करें',
    actionPrepareToMove: 'ऊँचे सुरक्षित स्थान पर जाने की तैयारी करें',
    actionEvacuateNow: 'तुरंत निर्धारित सुरक्षित आश्रय की ओर प्रस्थान करें',
    actionAvoidBlockedRoad: 'तटीय कॉजवे से बचें (जलमग्न मार्ग)',
    actionRequestHelp: 'आपातकालीन बचाव सहायता का अनुरोध करें',
    
    // Personalized Alerts
    alertFlood: 'नदी जलस्तर एवं समुद्री लहर वृद्धि चेतावनी',
    alertCyclone: 'चक्रवाती तूफान चेतावनी',
    alertRoadBlocked: 'सड़क अवरोध सूचना',
    alertShelterCapacity: 'आश्रय क्षमता चेतावनी',
    alertEvacuate: 'पूर्व निकासी सलाह',
    whyQuestion: 'यह चेतावनी क्यों?',
    whatShouldIDoQuestion: 'मुझे क्या करना चाहिए?',
    whereShouldIGoQuestion: 'मुझे कहाँ जाना चाहिए?',
    
    // SOS System
    sosTitle: 'आपातकालीन संकट संकेत (SOS)',
    sosSubtitle: 'सीधे जिला आपदा नियंत्रण कक्ष (DDMA) और NDRF को सूचित करता है',
    sosTypeLabel: 'आपातकाल का प्रकार',
    sosPeopleLabel: 'सहायता चाहने वाले कुल व्यक्ति',
    sosVulnerableLabel: 'संवेदनशील पारिवारिक सदस्य',
    sosElderly: 'वरिष्ठ नागरिक (65+ वर्ष)',
    sosInfants: 'शिशु एवं छोटे बच्चे',
    sosDisabled: 'दिव्यांगजन',
    sosMedical: 'चिकित्सा / ऑक्सीजन की आवश्यकता',
    sosPregnant: 'गर्भवती महिलाएं',
    sosTransmitBtn: 'तुरंत आपातकालीन SOS भेजें',
    sosTransmittedTitle: 'SOS नियंत्रण कक्ष को प्रेषित',
    sosPriorityAssigned: 'प्राथमिकता स्कोर निर्धारित',
    sosStatusSubmitted: 'SOS अनुरोध दर्ज हुआ',
    sosStatusReceived: 'DDMA नियंत्रण कक्ष द्वारा स्वीकृत',
    sosStatusAssigned: 'बचाव दल रवाना किया गया',
    sosStatusEnRoute: 'बचाव दल आपकी लोकेशन की ओर अग्रसर',
    sosStatusResolved: 'बचाव कार्य संपन्न / सुरक्षित',
    
    // Shelters & Capacities
    shelterAvailableHeadroom: 'उपलब्ध शेष स्थान',
    shelterCurrentOccupancy: 'वर्तमान में रुके लोग',
    shelterStatusOpen: 'खुला है (स्थान उपलब्ध)',
    shelterStatusNearCapacity: 'लगभग भरा हुआ',
    shelterStatusFull: 'पूर्ण भरा हुआ (वैकल्पिक आश्रय पर जाएं)',
    amenityWater: 'पीने योग्य पानी',
    amenityMedical: 'चिकित्सा एवं प्राथमिक उपचार',
    amenityElectricity: 'बिजली एवं जनरेटर सुविधा',
    amenitySanitation: 'स्वच्छता एवं शौचालय',
    amenityWheelchair: 'व्हीलचेयर / स्ट्रेचर सुलभ',
    
    // Routes
    routeStatusSafe: 'सुरक्षित एवं खुला मार्ग',
    routeStatusBlocked: 'जलभराव के कारण अवरुद्ध',
    routeRerouteNotice: 'तटीय कॉजवे जलमग्न होने के कारण मार्ग परिवर्तित किया गया है।',
    
    // Hazard Reporting
    reportHazardTitle: 'जमीनी खतरे या क्षति की रिपोर्ट करें',
    reportTypeSelect: 'खतरे की श्रेणी',
    reportSeveritySelect: 'गंभीरता',
    reportDescriptionPlaceholder: 'जलभराव, टूटे तार या खतरे का विवरण दें...',
    reportSubmitBtn: 'खतरे की रिपोर्ट सबमिट करें',
    reportStatusSubmitted: 'सबमिट किया गया',
    reportStatusReceived: 'नियंत्रण कक्ष द्वारा प्राप्त',
    reportStatusUnderReview: 'समीक्षाधीन',
    reportStatusVerified: 'फील्ड अधिकारी द्वारा सत्यापित',
    reportStatusResolved: 'समाधान किया गया',
    
    // Officer Emergency Center
    officerEmergencyTitle: 'अधिकारी आपातकालीन कमांड सेंटर',
    officerEmergencySubtitle: 'लाइव आपदा प्रबंधन एवं संसाधन आवंटन',
    liveSOSQueue: 'लाइव नागरिक SOS कतार',
    activeIncidents: 'सक्रिय घटनाएं एवं खतरे',
    priorityScoreLabel: 'प्राथमिकता स्कोर',
    dispatchResource: 'बचाव संसाधन भेजें',
    assignTeamBtn: 'दल आवंटित करें',
    timelineStage: 'घटना समयरेखा',
    shelterMonitor: 'जिला आश्रय क्षमता निगरानी',
    roadNetworkMonitor: 'निकासी मार्ग नेटवर्क स्थिति',
    
    // Phase 3: Field Tasks & Conflict
    fieldTasksTitle: 'जमीनी सच्चाई सत्यापन कार्य',
    fieldTasksSubtitle: 'फील्ड सर्वेक्षण टीमों के लिए सौंपे गए निरीक्षण कार्य',
    taskPending: 'सत्यापन लंबित',
    taskInProgress: 'प्रगति पर है',
    taskCompleted: 'पूर्ण हुआ',
    dataConflictDetected: 'डेटा विसंगति का पता चला',
    aiSensorModel: 'एआई / रिमोट सेंसर स्ट्रीम',
    fieldEvidence: 'भौतिक फील्ड निरीक्षण साक्ष्य',
    acceptFieldEvidence: 'फील्ड साक्ष्य स्वीकार करें (उच्च विश्वसनीयता)',
    retainAiModel: 'एआई उपग्रह मॉडल बनाए रखें',
    conflictResolvedBadge: 'अधिकारी द्वारा विसंगति का समाधान किया गया',
    
    // Phase 3: Audit Trail & Governance
    auditTrailTitle: 'व्याख्यात्मक ऑडिट ट्रेल एवं शासन खाता',
    auditTrailSubtitle: 'अपरिवर्तनीय मानवीय निर्णय लॉग और वैधानिक पुनर्वास चेकलिस्ट',
    filterByActor: 'अभिनेता द्वारा फ़िल्टर करें',
    filterBySettlement: 'बस्ती द्वारा फ़िल्टर करें',
    statutoryChecklistTitle: 'वैधानिक प्रशासनिक पुनर्वास समीक्षा',
    statutoryChecklistSubtitle: 'अंतिम राजपत्र अधिसूचना से पहले अनिवार्य अंतर-विभागीय स्वीकृतियां',
    
    // Phase 3: Recovery Center
    recoveryTitle: 'आपदा उपरांत पुनर्प्राप्ति एवं पुनर्निर्माण केंद्र',
    recoverySubtitle: 'पुनर्प्राप्ति प्राथमिकता गणना, क्षति मूल्यांकन और बुनियादी ढांचा पुनर्निर्माण ट्रैकिंग',
    totalEstimatedDamage: 'कुल अनुमानित क्षति',
    recoveryBudgetAllocated: 'आवंटित बजट',
    recoveryProjectsActive: 'सक्रिय पुनर्निर्माण परियोजनाएं',
    recoveryPriorityRank: 'पुनर्प्राप्ति प्राथमिकता रैंक',
    updateMilestone: 'माइलस्टोन / प्रगति अपडेट करें',
    recordCitizenClaim: 'नागरिक क्षति दावा दर्ज करें',

    // Labels
    riskScore: 'जोखिम स्कोर',
    exposureScore: 'एक्सपोजर स्कोर',
    vulnerabilityScore: 'संवेदनशीलता स्कोर',
    resilienceScore: 'पुनर्प्राप्ति क्षमता (Resilience)',
    dataConfidence: 'डेटा विश्वसनीयता',
    population: 'जनसंख्या',
    households: 'परिवार',
    costOfInaction: 'निष्क्रियता की लागत',
    carryingCapacity: 'वहन क्षमता (Capacity)',
    communityAcceptance: 'सामुदायिक स्वीकृति',
    emergencyMode: 'आपातकालीन परिचालन मोड (EMERGENCY MODE)'
  }
};
