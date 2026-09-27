import { ApprovalRequest } from '../types/omnichannel';
import { initialApprovals } from '../data/mockApprovals';

class ApprovalService {
  private approvals: ApprovalRequest[] = [...initialApprovals];

  async getApprovals(businessId?: string): Promise<ApprovalRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.approvals]), 40);
    });
  }

  async resolveApproval(id: string, status: 'approved' | 'rejected'): Promise<ApprovalRequest> {
    const index = this.approvals.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Approval request not found');

    this.approvals[index] = {
      ...this.approvals[index],
      status,
    };
    return this.approvals[index];
  }
}

export const approvalService = new ApprovalService();
