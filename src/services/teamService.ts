import { TeamMember, PricingPlan, NotificationItem } from '../types';
import { initialTeamMembers, pricingPlans, initialNotifications } from '../data/mockTeam';

const TEAM_STORAGE_KEY = 'scaleup_team';
const NOTIF_STORAGE_KEY = 'scaleup_notifications';

function getStoredTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialTeamMembers;
}

function saveTeam(team: TeamMember[]) {
  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
  } catch {
    // fallback
  }
}

function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialNotifications;
}

function saveNotifications(notifs: NotificationItem[]) {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
  } catch {
    // fallback
  }
}

export const teamService = {
  async getTeam(): Promise<TeamMember[]> {
    return getStoredTeam();
  },

  async inviteMember(email: string, role: 'Owner' | 'Admin' | 'Agent'): Promise<TeamMember> {
    const list = getStoredTeam();
    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: formattedName,
      email,
      role,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [...list, newMember];
    saveTeam(updated);
    return newMember;
  },

  async getPlans(): Promise<PricingPlan[]> {
    return pricingPlans;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return getStoredNotifications();
  },

  async markNotificationAsRead(id: string): Promise<NotificationItem[]> {
    const list = getStoredNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
    return updated;
  },

  async clearAllNotifications(): Promise<NotificationItem[]> {
    const updated: NotificationItem[] = [];
    saveNotifications(updated);
    return updated;
  },
};
