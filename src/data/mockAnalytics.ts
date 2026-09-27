export interface VolumeDataPoint {
  label: string;
  ai: number;
  human: number;
  total: number;
}

export interface LeadTrendPoint {
  label: string;
  leads: number;
  qualified: number;
}

export interface ProductPopularity {
  name: string;
  inquiries: number;
  percentage: number;
  revenuePotential: string;
}

export interface PeakHourData {
  hour: string;
  messages: number;
}

export const analyticsToday = {
  volume: [
    { label: '08:00', ai: 24, human: 2, total: 26 },
    { label: '10:00', ai: 68, human: 8, total: 76 },
    { label: '12:00', ai: 95, human: 12, total: 107 },
    { label: '14:00', ai: 62, human: 9, total: 71 },
    { label: '16:00', ai: 110, human: 14, total: 124 },
    { label: '18:00', ai: 140, human: 18, total: 158 },
    { label: '20:00', ai: 165, human: 15, total: 180 },
    { label: '22:00', ai: 78, human: 4, total: 82 },
  ] as VolumeDataPoint[],
  leads: [
    { label: '08:00', leads: 4, qualified: 2 },
    { label: '10:00', leads: 12, qualified: 7 },
    { label: '12:00', leads: 18, qualified: 11 },
    { label: '14:00', leads: 9, qualified: 5 },
    { label: '16:00', leads: 22, qualified: 14 },
    { label: '18:00', leads: 28, qualified: 19 },
    { label: '20:00', leads: 31, qualified: 21 },
    { label: '22:00', leads: 14, qualified: 8 },
  ] as LeadTrendPoint[],
};

export const analytics7Days = {
  volume: [
    { label: 'Mon', ai: 122, human: 18, total: 140 },
    { label: 'Tue', ai: 138, human: 21, total: 159 },
    { label: 'Wed', ai: 145, human: 22, total: 167 },
    { label: 'Thu', ai: 168, human: 29, total: 197 },
    { label: 'Fri', ai: 185, human: 34, total: 219 },
    { label: 'Sat', ai: 172, human: 30, total: 202 },
    { label: 'Sun', ai: 152, human: 24, total: 176 },
  ] as VolumeDataPoint[],
  leads: [
    { label: 'Mon', leads: 18, qualified: 11 },
    { label: 'Tue', leads: 22, qualified: 14 },
    { label: 'Wed', leads: 24, qualified: 15 },
    { label: 'Thu', leads: 31, qualified: 19 },
    { label: 'Fri', leads: 38, qualified: 26 },
    { label: 'Sat', leads: 33, qualified: 21 },
    { label: 'Sun', leads: 26, qualified: 17 },
  ] as LeadTrendPoint[],
};

export const analytics30Days = {
  volume: [
    { label: 'Week 1', ai: 840, human: 130, total: 970 },
    { label: 'Week 2', ai: 910, human: 142, total: 1052 },
    { label: 'Week 3', ai: 1050, human: 165, total: 1215 },
    { label: 'Week 4', ai: 1180, human: 180, total: 1360 },
  ] as VolumeDataPoint[],
  leads: [
    { label: 'Week 1', leads: 110, qualified: 62 },
    { label: 'Week 2', leads: 128, qualified: 74 },
    { label: 'Week 3', leads: 145, qualified: 88 },
    { label: 'Week 4', leads: 164, qualified: 98 },
  ] as LeadTrendPoint[],
};

export const popularProductsData: ProductPopularity[] = [
  { name: 'Modern L Sofa', inquiries: 428, percentage: 38, revenuePotential: 'QAR 1.49M' },
  { name: 'Luxury Bedroom Set', inquiries: 296, percentage: 26, revenuePotential: 'QAR 1.53M' },
  { name: 'Modern Dining Table', inquiries: 184, percentage: 16, revenuePotential: 'QAR 515K' },
  { name: 'Velvet Lounge Accent Chair', inquiries: 132, percentage: 12, revenuePotential: 'QAR 165K' },
  { name: 'Executive Ergonomic Desk', inquiries: 90, percentage: 8, revenuePotential: 'QAR 279K' },
];

export const peakMessagingHours: PeakHourData[] = [
  { hour: '09 AM', messages: 64 },
  { hour: '11 AM', messages: 112 },
  { hour: '01 PM', messages: 148 },
  { hour: '03 PM', messages: 95 },
  { hour: '05 PM', messages: 184 },
  { hour: '07 PM', messages: 242 },
  { hour: '09 PM', messages: 278 },
  { hour: '11 PM', messages: 121 },
];
