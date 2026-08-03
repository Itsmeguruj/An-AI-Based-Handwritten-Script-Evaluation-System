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
  }
};
