import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Settlement, 
  SafeSite, 
  AlertItem, 
  UserProfile, 
  HazardType, 
  RiskLevel, 
  PriorityLevel, 
  InterventionType,
  LanguageCode,
  SystemScoringWeights
} from '../types';
import { MockDataService, CURRENT_USER } from '../services/mockDataService';
import { HAZARD_LAYERS_CONFIG, HazardLayerConfig } from '../data/hazardsData';
import { DEFAULT_SCORING_WEIGHTS } from '../services/riskEngineService';
import { TRANSLATIONS } from '../data/translations';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AppState {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  
  // Data
  settlements: Settlement[];
  selectedSettlementId: string;
  setSelectedSettlementId: (id: string) => void;
  getSelectedSettlement: () => Settlement;
  
  safeSites: SafeSite[];
  selectedSafeSiteId: string;
  setSelectedSafeSiteId: (id: string) => void;
  getSelectedSafeSite: () => SafeSite;
  
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  
  // Map and Layers
  hazardLayers: HazardLayerConfig[];
  toggleHazardLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  
  // Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterHazard: HazardType | 'ALL';
  setFilterHazard: (h: HazardType | 'ALL') => void;
  filterRiskLevel: RiskLevel | 'ALL';
  setFilterRiskLevel: (r: RiskLevel | 'ALL') => void;
  filterPriority: PriorityLevel | 'ALL';
  setFilterPriority: (p: PriorityLevel | 'ALL') => void;
  filterDistrict: string | 'ALL';
  setFilterDistrict: (d: string | 'ALL') => void;
  resetFilters: () => void;
  
  // System Configurations & Modes
  emergencyMode: boolean;
  setEmergencyMode: (enabled: boolean) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  
  scoringWeights: SystemScoringWeights;
  setScoringWeights: (weights: SystemScoringWeights) => void;
  
  // Modals and Drawers
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendUserChatMessage: (msg: string) => void;
  
  isDecisionTraceOpen: boolean;
  setIsDecisionTraceOpen: (open: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Demo Tour
  tourStep: number;
  isTourActive: boolean;
  startDemoTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  
  // Dynamic Simulation actions
  triggerSimulatedDataUpdate: () => void;
  submitFieldVerificationEvidence: (settlementId: string, notes: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  
  const [settlements, setSettlements] = useState<Settlement[]>(MockDataService.getSettlements());
  const [selectedSettlementId, setSelectedSettlementId] = useState<string>('kadalpuram');
  
  const [safeSites, setSafeSites] = useState<SafeSite[]>(MockDataService.getSafeSites());
  const [selectedSafeSiteId, setSelectedSafeSiteId] = useState<string>('site-b');
  
  const [alerts, setAlerts] = useState<AlertItem[]>(MockDataService.getAlerts());
  const [hazardLayers, setHazardLayers] = useState<HazardLayerConfig[]>(HAZARD_LAYERS_CONFIG);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterHazard, setFilterHazard] = useState<HazardType | 'ALL'>('ALL');
  const [filterRiskLevel, setFilterRiskLevel] = useState<RiskLevel | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string | 'ALL'>('ALL');
  
  // System states
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [scoringWeights, setScoringWeights] = useState<SystemScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  
  // Modals & Chat
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isDecisionTraceOpen, setIsDecisionTraceOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: 'Namaste. I am RAKSHA Assistant. I can explain risk factors, justify relocation recommendations, evaluate carrying capacities, and simulate intervention costs. How may I assist you today?',
      timestamp: 'Just now'
    }
  ]);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Guided Demo Tour
  const [tourStep, setTourStep] = useState<number>(0);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getSelectedSettlement = (): Settlement => {
    return settlements.find(s => s.id === selectedSettlementId) || settlements[0];
  };

  const getSelectedSafeSite = (): SafeSite => {
    return safeSites.find(s => s.id === selectedSafeSiteId) || safeSites[0];
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    MockDataService.markAlertAsRead(id);
  };

  const toggleHazardLayer = (layerId: string) => {
    setHazardLayers(prev => prev.map(l => l.id === layerId ? { ...l, enabled: !l.enabled } : l));
  };

  const setLayerOpacity = (layerId: string, opacity: number) => {
    setHazardLayers(prev => prev.map(l => l.id === layerId ? { ...l, defaultOpacity: opacity } : l));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterHazard('ALL');
    setFilterRiskLevel('ALL');
    setFilterPriority('ALL');
    setFilterDistrict('ALL');
    addToast({
      type: 'info',
      title: 'Filters Reset',
      description: 'Showing all vulnerable habitations across district.'
    });
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  const sendUserChatMessage = (msg: string) => {
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    
    // Simulate assistant thinking
    setTimeout(() => {
      const replyText = MockDataService.getAIChatResponse(msg);
      const assistantMsg: ChatMessage = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    }, 450);
  };

  // Demo interactive simulator
  const triggerSimulatedDataUpdate = () => {
    setSettlements(prev => prev.map(s => {
      if (s.id === 'kadalpuram') {
        return {
          ...s,
          overallRisk: 93,
          dataConfidence: 96,
          lastUpdated: 'Just now (Simulated live InSAR sync)'
        };
      }
      return s;
    }));
    
    addToast({
      type: 'warning',
      title: 'Satellite SAR Sensor Sync Received',
      description: 'Shoreline retreat updated for Kadalpuram. Confidence boosted to 96%.'
    });
  };

  const submitFieldVerificationEvidence = (settlementId: string, notes: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          dataConfidence: 94,
          fieldVerified: true,
          fieldVerificationNotes: notes,
          status: 'FIELD_VERIFIED'
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'Human-in-the-Loop Evidence Verified',
      description: `Field officer evidence submitted. Data confidence increased from 72% to 94%.`
    });
  };

  // Guided Tour
  const startDemoTour = () => {
    setIsTourActive(true);
    setTourStep(1);
    setCurrentPage('dashboard');
    addToast({
      type: 'info',
      title: '4-Minute Hackathon Demo Tour Started',
      description: 'Follow the top guided banner for a complete walkthrough.'
    });
  };

  const nextTourStep = () => {
    const next = tourStep + 1;
    setTourStep(next);
    switch (next) {
      case 2:
        setSelectedSettlementId('kadalpuram');
        setCurrentPage('settlement-detail');
        break;
      case 3:
        setCurrentPage('intervention');
        break;
      case 4:
        setSelectedSafeSiteId('site-b');
        setCurrentPage('safe-sites');
        break;
      case 5:
        setCurrentPage('relocation');
        break;
      case 6:
        setCurrentPage('simulator');
        break;
      case 7:
        setCurrentPage('field-verification');
        break;
      case 8:
        setCurrentPage('reports');
        break;
      default:
        endTour();
        break;
    }
  };

  const prevTourStep = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentUser,
        setCurrentUser,
        settlements,
        selectedSettlementId,
        setSelectedSettlementId,
        getSelectedSettlement,
        safeSites,
        selectedSafeSiteId,
        setSelectedSafeSiteId,
        getSelectedSafeSite,
        alerts,
        markAlertRead,
        hazardLayers,
        toggleHazardLayer,
        setLayerOpacity,
        searchTerm,
        setSearchTerm,
        filterHazard,
        setFilterHazard,
        filterRiskLevel,
        setFilterRiskLevel,
        filterPriority,
        setFilterPriority,
        filterDistrict,
        setFilterDistrict,
        resetFilters,
        emergencyMode,
        setEmergencyMode,
        language,
        setLanguage,
        t,
        scoringWeights,
        setScoringWeights,
        isAIChatOpen,
        setIsAIChatOpen,
        chatMessages,
        sendUserChatMessage,
        isDecisionTraceOpen,
        setIsDecisionTraceOpen,
        toasts,
        addToast,
        removeToast,
        tourStep,
        isTourActive,
        startDemoTour,
        nextTourStep,
        prevTourStep,
        endTour,
        triggerSimulatedDataUpdate,
        submitFieldVerificationEvidence
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
