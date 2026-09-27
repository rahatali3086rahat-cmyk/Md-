import { apiClient, ApiResponse } from './apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'Owner' | 'Admin' | 'Agent';
  businessId?: string;
  businessName?: string;
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

export interface RegisterPayload {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  industry: string;
  phone?: string;
}

export const authApi = {
  /**
   * Client login
   */
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
    const cleanEmail = email.trim().toLowerCase();
    let user: AuthUser | null = null;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('whatsai_registered_users');
        if (stored) {
          const list: AuthUser[] = JSON.parse(stored);
          const found = list.find((u) => u.email.toLowerCase() === cleanEmail);
          if (found) user = { ...found, emailVerified: true };
        }
      } catch {}
    }

    if (!user) {
      const isAdminEmail = cleanEmail === 'admin@scaleupgulf.ai' || cleanEmail.includes('admin');
      const isRahat = cleanEmail.includes('rahat');
      const isDemoJassim = cleanEmail.includes('jassim') || cleanEmail.includes('sofana');

      let userName = 'Business Owner';
      let bizName = 'Gulf Enterprise Workspace';

      if (isAdminEmail) {
        userName = 'ScaleUp Executive Admin';
        bizName = 'ScaleUp Gulf AI Global';
      } else if (isRahat) {
        userName = 'Rahat Ali';
        bizName = 'Prestige Gulf Interiors';
      } else if (isDemoJassim) {
        userName = 'Sheikh Jassim Al-Kuwari';
        bizName = 'Sofana Furniture Doha';
      } else {
        const prefix = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        userName = prefix ? prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Business Owner';
        bizName = `${userName}'s Workspace`;
      }

      user = {
        id: `usr-${Date.now()}`,
        name: userName,
        email: email.trim(),
        role: isAdminEmail ? 'admin' : (isRahat ? 'Owner' : 'client'),
        businessId: `biz-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
        businessName: bizName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+974 5512 8844',
        emailVerified: true,
      };
    }

    const fallback: AuthResponseData = {
      user,
      token: `mock-jwt-${Date.now()}`,
      expiresIn: 86400,
    };

    const res = await apiClient.post<AuthResponseData>('/api/auth/login', { email, password }, fallback);
    const finalUser = res.data?.user || user;
    if (res.data?.token) {
      apiClient.setAuthToken(res.data.token);
      apiClient.setBusinessId(finalUser.businessId || null);
    }
    return {
      ...res,
      data: {
        ...res.data,
        user: finalUser,
      },
    };
  },

  /**
   * Dedicated Admin portal login
   */
  adminLogin: async (email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
    const fallback: AuthResponseData = {
      user: {
        id: 'usr-admin-01',
        name: 'ScaleUp Executive Admin',
        email: email || 'admin@scaleupgulf.ai',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        phone: '+974 4400 9988',
        emailVerified: true,
      },
      token: 'mock-jwt-admin-token-scaleupgulf',
      expiresIn: 86400,
    };

    const res = await apiClient.post<AuthResponseData>('/api/auth/admin-login', { email, password }, fallback);
    if (res.data?.token) {
      apiClient.setAuthToken(res.data.token);
      apiClient.setBusinessId(null); // Admin has platform-wide view
    }
    return res;
  },

  /**
   * Client registration
   */
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> => {
    const bizId = `biz-${Date.now()}`;
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: payload.ownerName.trim() || payload.businessName.trim(),
      email: payload.email.trim(),
      role: payload.email.toLowerCase().includes('rahat') ? 'Owner' : 'client',
      businessId: bizId,
      businessName: payload.businessName.trim(),
      phone: payload.phone?.trim() || '+974 5500 0000',
      emailVerified: true,
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('whatsai_registered_users');
        const list: AuthUser[] = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
        filtered.push(newUser);
        localStorage.setItem('whatsai_registered_users', JSON.stringify(filtered));
      } catch {}
    }

    const fallback: AuthResponseData = {
      user: newUser,
      token: `mock-jwt-client-registered-${Date.now()}`,
      expiresIn: 86400,
    };

    const res = await apiClient.post<AuthResponseData>('/api/auth/register', payload, fallback);
    const finalUser = res.data?.user || newUser;
    if (res.data?.token) {
      apiClient.setAuthToken(res.data.token);
      apiClient.setBusinessId(finalUser.businessId || null);
    }
    return {
      ...res,
      data: {
        ...res.data,
        user: finalUser,
      },
    };
  },

  /**
   * Request password reset link
   */
  forgotPassword: async (email: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.post('/api/auth/forgot-password', { email }, {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}.`,
    });
  },

  /**
   * Update password via token
   */
  resetPassword: async (password: string, token?: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.post('/api/auth/reset-password', { password, token }, {
      success: true,
      message: 'Password successfully updated. You may now log in.',
    });
  },

  /**
   * Verify email via confirmation token/code
   */
  verifyEmail: async (code?: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.post('/api/auth/verify-email', { code }, {
      success: true,
      message: 'Email address successfully verified.',
    });
  },

  /**
   * Logout and clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch {
      // Ignored if offline
    } finally {
      apiClient.setAuthToken(null);
      apiClient.setBusinessId(null);
    }
  },
};
