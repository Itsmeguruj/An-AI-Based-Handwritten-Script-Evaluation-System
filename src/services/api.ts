const API_BASE_URL = '/api/auth';

export interface RegisterDetails {
  name: string;
  email: string;
  mobile: string;
  countryCode: string;
  institution: string;
  department: string;
  username: string;
  verificationCode: string;
  password?: string;
  mobileOtp?: string;
  emailOtp?: string;
}

export interface LoginDetails {
  mobile: string;
  countryCode: string;
  emailOrMobile?: string;
  password?: string;
  otp?: string;
}

/**
 * Handle HTTP response error mapping
 */
async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Network error occurred. Please check your server.');
  }
  return data;
}

export const apiService = {
  /**
   * 1. Register coordinator account directly in database
   */
  async register(details: RegisterDetails) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return handleResponse(response);
  },

  /**
   * 3. Initiate coordinator login (check credentials, send OTP)
   */
  async initiateLogin(details: LoginDetails) {
    const response = await fetch(`${API_BASE_URL}/login-initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: details.mobile,
        countryCode: details.countryCode,
        emailOrMobile: details.emailOrMobile,
        password: details.password
      })
    });
    return handleResponse(response);
  },

  /**
   * 4. Verify login OTP and enter studio
   */
  async verifyLogin(details: LoginDetails) {
    const response = await fetch(`${API_BASE_URL}/login-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: details.mobile,
        countryCode: details.countryCode,
        emailOrMobile: details.emailOrMobile,
        otp: details.otp
      })
    });
    return handleResponse(response);
  },

  /**
   * 5. Verify admin login credentials (preventing coordinator bypass)
   */
  async verifyAdminLogin(details: { adminId: string; password?: string; securityKey?: string }) {
    const response = await fetch(`${API_BASE_URL}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminId: details.adminId,
        password: details.password,
        securityKey: details.securityKey
      })
    });
    return handleResponse(response);
  },

  /**
   * 6. Fetch all coordinators
   */
  async getCoordinators() {
    const response = await fetch(`${API_BASE_URL}/coordinators`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 6b. Get coordinator verification status
   */
  async getCoordinatorStatus(id: string) {
    const response = await fetch(`${API_BASE_URL}/coordinators/${id}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 7. Verify / toggle coordinator account access
   */
  async verifyCoordinator(id: string, isVerified: boolean = true) {
    const response = await fetch(`${API_BASE_URL}/coordinators/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified })
    });
    return handleResponse(response);
  },

  /**
   * 8. Create a new system log entry
   */
  async createLog(details: { action: string; actorRole: 'admin' | 'coordinator'; actorName: string; browser: string }) {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return handleResponse(response);
  },

  /**
   * 9. Fetch system logs with filters
   */
  async getLogs(filters?: { role?: string; actionCategory?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.actionCategory) queryParams.append('actionCategory', filters.actionCategory);
    if (filters?.search) queryParams.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/logs?${queryParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 10. Send Registration OTP
   */
  async sendRegisterOtp(emailOrMobile: string, type: 'email' | 'mobile') {
    const response = await fetch(`${API_BASE_URL}/register-otp-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrMobile, type })
    });
    return handleResponse(response);
  },

  /**
   * 11. Verify Registration OTP
   */
  async verifyRegisterOtp(emailOrMobile: string, otp: string, type: 'email' | 'mobile') {
    const response = await fetch(`${API_BASE_URL}/register-otp-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrMobile, otp, type })
    });
    return handleResponse(response);
  },

  /**
   * 12. Send Email OTP for Mobile Number Update
   */
  async sendUpdateMobileOtp(email: string) {
    const response = await fetch(`${API_BASE_URL}/update-mobile-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  /**
   * 13. Verify OTP and Update Mobile Number in Coordinator Profile
   */
  async verifyAndUpdateMobile(details: { email: string; otp: string; newMobile: string; newCountryCode: string }) {
    const response = await fetch(`${API_BASE_URL}/update-mobile-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return handleResponse(response);
  },

  /**
   * 14. Save or Update Coordinator Reverted Evaluation Result
   */
  async saveRevertedResult(result: {
    id?: string;
    serialNo: string;
    studentBookletId?: string;
    paperName: string;
    studentAnswerFileName: string;
    coordinatorName: string;
    totalScore: number;
    maxScore: number;
    questionResults?: any[];
    evaluatedAt?: string;
    status?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/reverted-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    return handleResponse(response);
  },

  /**
   * 15. Fetch all Coordinator Reverted Evaluation Results
   */
  async getRevertedResults() {
    const response = await fetch(`${API_BASE_URL}/reverted-results`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 16. Delete a Reverted Result
   */
  async deleteRevertedResult(id: string) {
    const response = await fetch(`${API_BASE_URL}/reverted-results/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 17. Save / Update Coordinator Assignments
   */
  async saveAssignments(payload: { coordinatorAssignments?: any; coordinatorId?: string; assignment?: any }) {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 18. Fetch all Coordinator Assignments
   */
  async getAssignments() {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 19. Revoke / Delete Assignment
   */
  async deleteAssignment(coordinatorId: string, serialNo: string) {
    const response = await fetch(`${API_BASE_URL}/assignments/${coordinatorId}/${serialNo}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 20. Fetch Coordinator Script Review Queue
   */
  async getReviewQueue() {
    const response = await fetch('/api/coordinator/scripts/review-queue', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 21. Fetch Script Blocks & Consolidated Answers
   */
  async getScriptBlocks(scriptId: string) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/blocks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 22. Reassign Extracted Block to Question Bucket
   */
  async reassignBlock(scriptId: string, payload: { block_id: string; new_question_id: string; new_module?: number }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/reassign-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 23. Merge Blocks for a Question
   */
  async mergeBlocks(scriptId: string, payload: { target_question_id: string; ordered_block_ids: string[] }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/merge-blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 24. Create Manual Selection Block
   */
  async createBlock(scriptId: string, payload: { page_number: number; question_id: string; module_number?: number; raw_text: string; is_continuation?: boolean; bounding_box?: { x: number; y: number; width: number; height: number } }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/create-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 25. Approve Script & Submit to AI Grading Queue
   */
  async approveAndAggregateScript(scriptId: string) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/approve-and-aggregate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 26. Update Block Details (Inline text, question_id, continuation status, bounding_box)
   */
  async updateBlock(scriptId: string, payload: { block_id: string; raw_text?: string; question_id?: string; module_number?: number; is_continuation?: boolean; confidence_score?: number; bounding_box?: { x: number; y: number; width: number; height: number } }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/update-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 26B. Save All Blocks & Commit Grab Handle Positions
   */
  async saveAllBlocks(scriptId: string, payload: { blocks: any[]; consolidatedAnswers?: any[] }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/save-all-blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 27. Delete Block
   */
  async deleteBlock(scriptId: string, block_id: string) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/delete-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ block_id })
    });
    return handleResponse(response);
  },

  /**
   * 28. Split Block into Two
   */
  async splitBlock(scriptId: string, payload: { block_id: string; split_index: number; new_question_id_2?: string }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/split-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  /**
   * 29. Auto-Detect Multi-Page Continuations
   */
  async autoDetectContinuations(scriptId: string) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/auto-detect-continuations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  /**
   * 30. Manual Consolidated Answer Override Update
   */
  async updateConsolidatedAnswer(scriptId: string, payload: { question_id: string; combined_text: string }) {
    const response = await fetch(`/api/coordinator/scripts/${scriptId}/update-consolidated-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  }
};


