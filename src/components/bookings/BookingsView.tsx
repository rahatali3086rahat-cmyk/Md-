import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  RotateCw,
  Bell,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Booking, BookingStatus, ChannelType } from '../../types/omnichannel';
import { Modal } from '../common/Modal';

export const BookingsView: React.FC = () => {
  const {
    bookings,
    createBooking,
    updateBookingStatus,
    servicesList,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [search, setSearch] = useState('');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [channel, setChannel] = useState<ChannelType>('whatsapp');
  const [serviceId, setServiceId] = useState(servicesList[0]?.id || 'srv-001');
  const [bookingDate, setBookingDate] = useState('2026-09-20');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [assignedStaff, setAssignedStaff] = useState('Sarah Jenkins');
  const [location, setLocation] = useState('Virtual 3D Room Studio');
  const [notes, setNotes] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(search));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    return true;
  });

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-teal-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'pending':
        return { label: 'Pending Confirmation', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'rescheduled':
        return { label: 'Rescheduled', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenService = servicesList.find((s) => s.id === serviceId);

    await createBooking({
      businessId: 'biz-sofana',
      customerName,
      customerPhone,
      customerEmail,
      channelOrigin: channel,
      channel,
      price: chosenService?.price || 0,
      currency: chosenService?.currency || 'BDT',
      serviceName: chosenService?.name || 'Design Consultation',
      serviceId,
      date: bookingDate,
      time: bookingTime,
      durationMinutes: chosenService?.durationMinutes || 60,
      status: 'confirmed',
      assignedStaff,
      location,
      notes,
    });

    setIsNewBookingModalOpen(false);
    // Reset
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
  };

  const handleSendReminder = (booking: Booking) => {
    addToast(
      'success',
      'Reminder Dispatched',
      `Automated booking reminder sent to ${booking.customerName} via ${booking.channel}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Bookings & Service Appointments
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            AI-scheduled and manually coordinated client consultations, showroom visits, and styling sessions across all communication channels.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendar
            </button>
          </div>

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Bookings
          </p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{bookings.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
            Synced across 5 channels
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Confirmed Slots
          </p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 inline-block">Next 7 days</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI Automated
          </p>
          <p className="text-xl font-extrabold text-blue-700 mt-1">82%</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 inline-block">
            Zero human intervention
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Attendance Rate
          </p>
          <p className="text-xl font-extrabold text-purple-700 mt-1">94.6%</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 inline-block">
            With WhatsApp reminders
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, service or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            {(['all', 'confirmed', 'pending', 'rescheduled', 'completed', 'cancelled'] as const).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        {/* View Mode: List or Calendar */}
        {viewMode === 'list' ? (
          <div className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No appointments matching this filter
              </div>
            ) : (
              filteredBookings.map((b) => {
                const badge = getStatusBadge(b.status);

                return (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Left Details */}
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex flex-col items-center justify-center text-center shrink-0">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {new Date(b.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-extrabold text-emerald-900 leading-none">
                          {new Date(b.date).getDate()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{b.serviceName}</h4>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full border font-bold ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {b.customerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {b.time} ({b.durationMinutes} mins)
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {b.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-medium">
                            {getChannelIcon(b.channel)}
                            <span>Booked via {b.channel}</span>
                          </span>
                          <span>· Specialist: {b.assignedStaff}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleSendReminder(b)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                        title="Dispatch channel reminder"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>Remind</span>
                      </button>

                      {b.status !== 'completed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Complete</span>
                        </button>
                      )}

                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          Confirm
                        </button>
                      )}

                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Interactive Mini-Calendar Grid */
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">September 2026 Schedule</h3>
              <div className="flex items-center gap-1 text-slate-500">
                <button className="p-1 rounded-lg hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 px-2">September 2026</span>
                <button className="p-1 rounded-lg hover:bg-slate-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const dayStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
                const dayBookings = bookings.filter((b) => b.date === dayStr);

                return (
                  <div
                    key={i}
                    className={`min-h-[85px] p-2 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      dayBookings.length > 0
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : 'bg-slate-50/40 border-slate-200/60'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{dayNum}</span>
                      {dayBookings.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {dayBookings.slice(0, 2).map((db) => (
                        <div
                          key={db.id}
                          className="text-[9.5px] p-1 rounded bg-white border border-slate-200 truncate font-semibold text-slate-800"
                          title={`${db.customerName} - ${db.time}`}
                        >
                          {db.time} {db.customerName}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-[9px] text-slate-500 font-bold">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create New Booking Modal */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="Schedule New Appointment"
        subtitle="Book a consultation across your communication channels"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Fatima Al-Kuwari"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+974 5512 8901"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Channel Origin</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ChannelType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="whatsapp">WhatsApp Business</option>
                <option value="facebook">Facebook Messenger</option>
                <option value="instagram">Instagram Direct</option>
                <option value="website">Website Chat Widget</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Service Offering</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
              >
                {servicesList.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.durationMinutes} min - {srv.currency} {srv.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Specialist</label>
              <select
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Nora Al-Thani">Nora Al-Thani</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location / Venue</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Flagship Showroom or Virtual Studio"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Appointment Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specific customer requests, room measurements, or fabric samples..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewBookingModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
            >
              Schedule Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
