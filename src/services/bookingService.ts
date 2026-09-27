import { Booking, BookingStatus } from '../types/omnichannel';
import { initialBookings } from '../data/mockBookings';

class BookingService {
  private bookings: Booking[] = [...initialBookings];

  async getBookings(businessId?: string): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.bookings]), 50);
    });
  }

  async createBooking(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...data,
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    this.bookings[index] = { ...this.bookings[index], status };
    return this.bookings[index];
  }

  async deleteBooking(id: string): Promise<void> {
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}

export const bookingService = new BookingService();
