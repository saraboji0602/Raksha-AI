/**
 * RAKSHA-AI API Client
 * Provides resilient, typed HTTP communication with the FastAPI backend.
 * Falls back gracefully to in-memory datasets if backend is offline or during SSR.
 */

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  isFallback: boolean;
}

const API_BASE = '/api';

export class ApiClient {
  /**
   * Safe GET request with automatic fallback
   */
  static async get<T>(endpoint: string, fallbackData: T): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        error: null,
        isFallback: false
      };
    } catch (err: any) {
      return {
        data: fallbackData,
        error: err.message || 'Backend offline',
        isFallback: true
      };
    }
  }

  /**
   * Safe POST request with automatic fallback
   */
  static async post<T, B>(endpoint: string, body: B, fallbackData: T): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        error: null,
        isFallback: false
      };
    } catch (err: any) {
      return {
        data: fallbackData,
        error: err.message || 'Backend offline',
        isFallback: true
      };
    }
  }

  /**
   * Health check
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get Decomposed Risk for a Habitation
   */
  static async getRiskDecomposition(habitationId: string, fallbackData: any): Promise<ApiResponse<any>> {
    return this.get(`/risk/habitations/${habitationId}`, fallbackData);
  }

  /**
   * Get Dual Prioritization Matrix
   */
  static async getPriorities(fallbackData: any): Promise<ApiResponse<any>> {
    return this.get('/priorities', fallbackData);
  }

  /**
   * Get Decision Analysis (Protect / Adapt / Relocate)
   */
  static async getDecisionAnalysis(habitationId: string, fallbackData: any): Promise<ApiResponse<any>> {
    return this.get(`/decisions/${habitationId}`, fallbackData);
  }

  /**
   * Record Statutory Human Decision Approval under DM Act 2005
   */
  static async approveDecision(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/decisions/approve', payload, fallbackData);
  }

  /**
   * Run What-if Scenario Simulation
   */
  static async runScenarioSimulation(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/scenarios/run', payload, fallbackData);
  }

  /**
   * Get Data Quality Summary
   */
  static async getDataQualitySummary(fallbackData: any): Promise<ApiResponse<any>> {
    return this.get('/data-quality', fallbackData);
  }

  /**
   * Get Statutory Data Health Matrix
   */
  static async getDataHealth(fallbackData: any): Promise<ApiResponse<any>> {
    return this.get('/data-health', fallbackData);
  }

  /**
   * Get Operational System Mode & Status
   */
  static async getSystemStatus(fallbackData: any): Promise<ApiResponse<any>> {
    return this.get('/system/status', fallbackData);
  }

  /**
   * Get Emergency Shelters
   */
  static async getShelters(settlementId?: string, fallbackData?: any): Promise<ApiResponse<any>> {
    const query = settlementId ? `?settlement_id=${settlementId}` : '';
    return this.get(`/shelters${query}`, fallbackData || []);
  }

  /**
   * Get Evacuation Routes and Blockage Status
   */
  static async getEvacuationStatus(settlementId: string = 'kadalpuram', fallbackData?: any): Promise<ApiResponse<any>> {
    return this.get(`/evacuation-status?settlement_id=${settlementId}`, fallbackData || {});
  }

  /**
   * Get Immutable Statutory Audit Logs
   */
  static async getAuditLogs(limit: number = 50, fallbackData?: any): Promise<ApiResponse<any>> {
    return this.get(`/audit-logs?limit=${limit}`, fallbackData || { total: 0, items: [] });
  }

  /**
   * Append Entry to Statutory Audit Ledger
   */
  static async createAuditLog(payload: any, fallbackData?: any): Promise<ApiResponse<any>> {
    return this.post('/audit-logs', payload, fallbackData || {});
  }

  /**
   * Get Emergency SOS Queue
   */
  static async getSOSList(fallbackData: any): Promise<ApiResponse<any>> {
    return this.get('/sos', fallbackData);
  }

  /**
   * Submit Citizen SOS Beacon
   */
  static async createSOS(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/sos', payload, fallbackData);
  }

  /**
   * Update SOS Status or Assign Team
   */
  static async updateSOS(sosId: string, payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post(`/sos/${sosId}`, payload, fallbackData);
  }

  /**
   * Get Field Verification Reports
   */
  static async getFieldReports(settlementId?: string, fallbackData?: any): Promise<ApiResponse<any>> {
    const query = settlementId ? `?settlement_id=${settlementId}` : '';
    return this.get(`/reports${query}`, fallbackData || { total: 0, items: [] });
  }

  /**
   * Submit Field Observation Report
   */
  static async createFieldReport(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/reports', payload, fallbackData);
  }

  /**
   * Verify Ground Truth Field Report
   */
  static async verifyFieldReport(reportId: string, payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post(`/reports/${reportId}/verify`, payload, fallbackData);
  }

  /**
   * Get Emergency Rescue & Medical Resources
   */
  static async getResources(category?: string, fallbackData?: any): Promise<ApiResponse<any>> {
    const query = category ? `?category=${category}` : '';
    return this.get(`/resources${query}`, fallbackData || { total: 0, items: [] });
  }

  /**
   * Dispatch Resource to Incident
   */
  static async assignResource(resourceId: string, payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post(`/resources/${resourceId}/assign`, payload, fallbackData);
  }

  /**
   * Get Field Teams (SDRF, NDRF, Medical, Revenue)
   */
  static async getFieldTeams(fallbackData?: any): Promise<ApiResponse<any>> {
    return this.get('/field-teams', fallbackData || { total: 0, items: [] });
  }

  /**
   * Assign Task to Field Team
   */
  static async assignFieldTeam(teamId: string, payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post(`/field-teams/${teamId}/assign`, payload, fallbackData);
  }

  /**
   * Get Operational Incidents
   */
  static async getIncidents(settlementId?: string, fallbackData?: any): Promise<ApiResponse<any>> {
    const query = settlementId ? `?settlement_id=${settlementId}` : '';
    return this.get(`/incidents${query}`, fallbackData || { total: 0, items: [] });
  }

  /**
   * Create Operational Incident
   */
  static async createIncident(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/incidents', payload, fallbackData);
  }

  /**
   * Get Citizen Community Reports
   */
  static async getCommunityReports(settlementId?: string, fallbackData?: any): Promise<ApiResponse<any>> {
    const query = settlementId ? `?settlement_id=${settlementId}` : '';
    return this.get(`/community-reports${query}`, fallbackData || { total: 0, items: [] });
  }

  /**
   * Create Citizen Community Report
   */
  static async createCommunityReport(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/community-reports', payload, fallbackData);
  }

  /**
   * Action Citizen Community Report (VERIFY, REJECT, REQUEST_MORE_INFORMATION, MARK_DUPLICATE)
   */
  static async actionCommunityReport(reportId: string, payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post(`/community-reports/${reportId}/action`, payload, fallbackData);
  }

  /**
   * Get CAP-Compatible Early Warning Alerts
   */
  static async getAlerts(fallbackData?: any): Promise<ApiResponse<any>> {
    return this.get('/alerts', fallbackData || { total: 0, items: [] });
  }

  /**
   * Broadcast CAP Warning
   */
  static async createAlert(payload: any, fallbackData: any): Promise<ApiResponse<any>> {
    return this.post('/alerts', payload, fallbackData);
  }

  /**
   * Get Regional Command Summary (State / District / Taluk)
   */
  static async getRegionalSummary(fallbackData?: any): Promise<ApiResponse<any>> {
    return this.get('/regional/summary', fallbackData || {});
  }
}

