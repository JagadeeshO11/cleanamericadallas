import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ORDER_STAGES = ['Confirmed', 'Pro Assigned', 'En Route', 'Service In Progress', 'Completed'];
let _counter = 0;

const DEFAULT_JOB_PROGRESS = {
  checkedInAt: null,
  checkedOutAt: null,
  checklist: [
    { id: 1, task: 'Initial property walk-through & pre-clean inspection', done: false },
    { id: 2, task: 'High dusting & ceiling fan / light fixture wipe down', done: false },
    { id: 3, task: 'Deep kitchen counters, sink & appliance exterior sanitize', done: false },
    { id: 4, task: 'Bathroom scrub: shower, tub, toilet, mirror & vanity', done: false },
    { id: 5, task: 'Vacuum all carpets & steam mop hard surface flooring', done: false },
    { id: 6, task: 'Empty trash bins & replace fresh liner bags', done: false },
    { id: 7, task: 'Final inspection & lock-up confirmation', done: false }
  ],
  beforePhotos: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80'],
  afterPhotos: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&q=80'],
  problemReports: [],
  completionReport: null
};

const DEFAULT_NOTIFICATIONS = [
  { id: 'n1', title: '🎉 Welcome to Clean America Dallas', body: 'Book certified Dallas pros with instant 100% satisfaction guarantee', time: 'Just now', read: false, type: 'welcome' },
  { id: 'n2', title: '🏷️ Dallas Special Discount', body: 'Use promo code DALLAS15 at checkout for 15% OFF your booking', time: '5m ago', read: false, type: 'promo' },
  { id: 'n3', title: '📄 New Quotation Ready (#Q-1001)', body: 'Your Deep House Cleaning quotation of $280.00 is ready for approval.', time: '10m ago', read: false, type: 'quote' }
];

const DEFAULT_QUOTES = [
  {
    id: 'Q-1001',
    customerId: 'c1',
    customerName: 'Sarah Connor',
    serviceType: 'Deep House Cleaning & Detail',
    propertyType: 'Single Family Home',
    propertySize: '2,500 sq ft (4 Bed / 3 Bath)',
    frequency: 'One-Time Deep Clean',
    preferredDate: '2026-09-08',
    preferredTime: '09:00 AM',
    notes: 'Please pay extra attention to kitchen oven and window blinds.',
    status: 'quoted', // 'pending_quote' | 'quoted' | 'approved' | 'declined'
    createdAt: '2026-09-01T14:30:00Z',
    validUntil: '2026-09-15',
    priceDetails: {
      basePrice: 240.00,
      additions: [
        { name: 'Oven & Range Deep Clean', cost: 25.00 },
        { name: 'Eco Sanitation Supplies', cost: 15.00 },
      ],
      discount: 0,
      tax: 0,
      total: 280.00,
      estimatedHours: '3.5 - 4 hours',
      recommendedPros: 'Dallas Master Cleaning Crew'
    }
  },
  {
    id: 'Q-1002',
    customerId: 'c1',
    customerName: 'Sarah Connor',
    serviceType: 'Commercial Office Sanitizing',
    propertyType: 'Commercial Suite',
    propertySize: '4,200 sq ft',
    frequency: 'Bi-Weekly Recurring',
    preferredDate: '2026-09-12',
    preferredTime: '06:00 PM (After hours)',
    notes: 'Requires keycard access after 6 PM.',
    status: 'pending_quote',
    createdAt: '2026-09-02T10:15:00Z',
    validUntil: null,
    priceDetails: null
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'INV-8021',
    orderId: 'CAD90218_1',
    quoteId: null,
    customerId: 'c1',
    customerName: 'Sarah Connor',
    serviceName: 'Full Home Standard Cleaning',
    issuedDate: '2026-09-01',
    dueDate: '2026-09-10',
    amount: 189.00,
    tax: 15.60,
    discount: 0,
    total: 204.60,
    status: 'unpaid', // 'unpaid' | 'paid'
    paidAt: null,
    paymentMethod: null,
    lineItems: [
      { description: 'Standard Residential Clean (3 Bed/2 Bath)', amount: 189.00 },
      { description: 'Texas Sales Tax (8.25%)', amount: 15.60 }
    ]
  },
  {
    id: 'INV-8015',
    orderId: 'CAD88102_1',
    quoteId: 'Q-1000',
    customerId: 'c1',
    customerName: 'Sarah Connor',
    serviceName: 'Eco Carpet & Hardwood Floor Care',
    issuedDate: '2026-08-25',
    dueDate: '2026-08-28',
    amount: 245.00,
    tax: 20.20,
    discount: 15.00,
    total: 250.20,
    status: 'paid',
    paidAt: '2026-08-28T16:20:00Z',
    paymentMethod: 'Visa ending in 4242',
    lineItems: [
      { description: 'Eco Carpet Steam Clean & Extraction', amount: 245.00 },
      { description: 'Dallas Promo Discount (DALLAS15)', amount: -15.00 },
      { description: 'Texas Sales Tax (8.25%)', amount: 20.20 }
    ]
  }
];

const DEFAULT_COMPLAINTS = [
  {
    id: 'TKT-402',
    orderId: 'CAD88102_1',
    customerId: 'c1',
    customerName: 'Sarah Connor',
    category: 'quality', // 'quality' | 'timeliness' | 'pro_behavior' | 'billing' | 'damage' | 'other'
    subject: 'Dusting missed on master suite shelving unit',
    description: 'The overall clean was very good, but the upper shelf of the master bookshelf was left untouched.',
    priority: 'medium', // 'low' | 'medium' | 'high'
    status: 'in_review', // 'open' | 'in_review' | 'resolved'
    createdAt: '2026-08-29T11:00:00Z',
    updates: [
      { time: '2026-08-29T11:00:00Z', text: 'Support ticket submitted by customer.' },
      { time: '2026-08-29T14:20:00Z', text: 'Clean America Dallas support assigned team lead for resolution credit.' }
    ]
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'REV-101',
    orderId: 'CAD88102_1',
    customerId: 'c1',
    customerName: 'Sarah Connor',
    workerId: 'w1',
    workerName: 'John Miller',
    rating: 5,
    qualityRating: 5,
    punctualityRating: 5,
    comment: 'John did a phenomenal job! My hardwood floors shine like brand new.',
    tipAmount: 15.00,
    createdAt: '2026-08-28T18:00:00Z'
  }
];

export const useStore = create(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,
      cart: [],
      notifications: DEFAULT_NOTIFICATIONS,
      quotes: DEFAULT_QUOTES,
      invoices: DEFAULT_INVOICES,
      complaints: DEFAULT_COMPLAINTS,
      reviews: DEFAULT_REVIEWS,

      addNotification: (notif) => {
        const item = {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          title: notif.title,
          body: notif.body,
          type: notif.type || 'info',
          time: 'Just now',
          read: false,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ notifications: [item, ...s.notifications] }));
      },

      markAllNotificationsRead: () => {
        set(s => ({
          notifications: s.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      clearNotifications: () => set({ notifications: [] }),

      addToCart: (vehicle, booking) => {
        const item = { cartId: `cart-${Date.now()}`, vehicle, booking };
        set(s => ({ cart: [...s.cart, item] }));
      },

      removeFromCart: (cartId) => {
        set(s => ({ cart: s.cart.filter(i => i.cartId !== cartId) }));
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: (vehicle, booking, customer) => {
        const orderId = `CAD${Date.now().toString().slice(-6)}_${++_counter}`;
        const order = {
          id: orderId,
          vehicle,
          booking,
          customer: customer || { name: 'Guest', phone: '' },
          stage: 0,
          stages: ORDER_STAGES,
          operator: null,
          placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString(),
          status: 'pending',
          scheduledDate: booking.date || new Date().toISOString().split('T')[0],
          scheduledTime: booking.time || '09:00 AM',
        };

        // Create corresponding unpaid invoice
        const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
        const subtotal = Number(booking.total) || Number(vehicle.rate) || 100;
        const tax = Math.round(subtotal * 0.0825 * 100) / 100;
        const newInvoice = {
          id: invId,
          orderId,
          quoteId: null,
          customerId: customer?.id || 'c1',
          customerName: customer?.name || 'Valued Customer',
          serviceName: vehicle.name || 'Cleaning Service',
          issuedDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          amount: subtotal,
          tax,
          discount: 0,
          total: subtotal + tax,
          status: 'unpaid',
          paidAt: null,
          paymentMethod: null,
          lineItems: [
            { description: `${vehicle.name} (${booking.duration || 1} ${vehicle.unit || 'service'})`, amount: subtotal },
            { description: 'Texas Sales Tax (8.25%)', amount: tax }
          ]
        };
        
        set(s => ({
          orders: [order, ...s.orders],
          invoices: [newInvoice, ...s.invoices],
          activeOrder: order,
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `🎉 Booking #${orderId} Confirmed!`,
              body: `Scheduled for ${vehicle.name} at ${booking.location || 'Dallas, TX'}. Invoice #${invId} created.`,
              type: 'order',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
        return order;
      },

      rescheduleOrder: (orderId, newDate, newTime) => {
        set(s => ({
          orders: s.orders.map(o => o.id === orderId ? {
            ...o,
            scheduledDate: newDate,
            scheduledTime: newTime,
            booking: { ...o.booking, date: newDate, time: newTime }
          } : o),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `📅 Service Rescheduled: #${orderId}`,
              body: `Your appointment has been moved to ${newDate} at ${newTime}.`,
              type: 'order',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
      },

      assignWorker: (orderId, worker) => {
        set(s => ({
          orders: s.orders.map(o =>
            o.id === orderId
              ? { ...o, operator: worker, stage: 1, status: 'assigned' }
              : o
          ),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `👷 Dallas Pro Assigned: #${orderId}`,
              body: `${worker.name} has been assigned to your service appointment.`,
              type: 'worker',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
      },

      advanceStage: (orderId) => {
        set(s => {
          let stageName = '';
          const updated = s.orders.map(o => {
            if (o.id !== orderId) return o;
            const newStage = Math.min(o.stage + 1, ORDER_STAGES.length - 1);
            stageName = ORDER_STAGES[newStage];
            return {
              ...o,
              stage: newStage,
              status: newStage === ORDER_STAGES.length - 1 ? 'completed' : 'active',
            };
          });
          const updatedOrder = updated.find(o => o.id === orderId);

          const newNotif = {
            id: `notif-${Date.now()}`,
            title: `🚚 Appointment Status Update`,
            body: `Booking #${orderId} stage updated to "${stageName || 'In Progress'}".`,
            type: 'stage',
            time: 'Just now',
            read: false,
          };

          return {
            orders: updated,
            activeOrder: s.activeOrder?.id === orderId ? updatedOrder : s.activeOrder,
            notifications: [newNotif, ...s.notifications]
          };
        });
      },

      cancelOrder: (orderId) => {
        set(s => ({
          orders: s.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o),
          activeOrder: s.activeOrder?.id === orderId ? null : s.activeOrder,
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `❌ Order Cancelled: #${orderId}`,
              body: `Your booking #${orderId} was cancelled successfully.`,
              type: 'cancel',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
      },

      setActiveOrder: (order) => set({ activeOrder: order }),
      clearActiveOrder: () => set({ activeOrder: null }),

      // QUOTE ACTIONS
      requestQuote: (quoteData) => {
        const qId = `Q-${Math.floor(1000 + Math.random() * 9000)}`;
        const newQuote = {
          id: qId,
          customerId: quoteData.customerId || 'c1',
          customerName: quoteData.customerName || 'Sarah Connor',
          serviceType: quoteData.serviceType,
          propertyType: quoteData.propertyType || 'Residential',
          propertySize: quoteData.propertySize || '2,000 sq ft',
          frequency: quoteData.frequency || 'One-Time',
          preferredDate: quoteData.preferredDate || new Date().toISOString().split('T')[0],
          preferredTime: quoteData.preferredTime || '10:00 AM',
          notes: quoteData.notes || '',
          status: 'pending_quote',
          createdAt: new Date().toISOString(),
          validUntil: null,
          priceDetails: null,
        };

        set(s => ({
          quotes: [newQuote, ...s.quotes],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `📋 Quote Request Received (#${qId})`,
              body: `Our Dallas estimating team is calculating your custom quote for ${quoteData.serviceType}.`,
              type: 'quote',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
        return newQuote;
      },

      approveQuote: (quoteId, scheduleDetails) => {
        set(s => {
          const targetQuote = s.quotes.find(q => q.id === quoteId);
          if (!targetQuote) return s;

          const updatedQuotes = s.quotes.map(q => q.id === quoteId ? { ...q, status: 'approved' } : q);

          // Convert approved quote to a scheduled order
          const orderId = `CAD${Date.now().toString().slice(-6)}_${++_counter}`;
          const totalAmount = targetQuote.priceDetails?.total || 250;
          const newOrder = {
            id: orderId,
            vehicle: {
              id: `quote-serv-${Date.now()}`,
              name: targetQuote.serviceType,
              desc: `Custom Cleaning Quote #${quoteId} for ${targetQuote.propertyType}`,
              rate: totalAmount,
              unit: 'job',
              image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80'
            },
            booking: {
              location: 'Dallas Metro, TX',
              date: scheduleDetails?.date || targetQuote.preferredDate || new Date().toISOString().split('T')[0],
              time: scheduleDetails?.time || targetQuote.preferredTime || '09:00 AM',
              duration: 1,
              notes: targetQuote.notes,
              total: totalAmount,
              paymentMethod: 'Invoice Pending'
            },
            customer: { id: targetQuote.customerId, name: targetQuote.customerName },
            stage: 0,
            stages: ORDER_STAGES,
            operator: null,
            placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString(),
            status: 'pending',
            scheduledDate: scheduleDetails?.date || targetQuote.preferredDate,
            scheduledTime: scheduleDetails?.time || targetQuote.preferredTime,
          };

          // Generate invoice for approved quote
          const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
          const tax = Math.round(totalAmount * 0.0825 * 100) / 100;
          const newInvoice = {
            id: invId,
            orderId,
            quoteId: quoteId,
            customerId: targetQuote.customerId,
            customerName: targetQuote.customerName,
            serviceName: targetQuote.serviceType,
            issuedDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            amount: totalAmount,
            tax,
            discount: 0,
            total: totalAmount + tax,
            status: 'unpaid',
            paidAt: null,
            paymentMethod: null,
            lineItems: [
              { description: `Quote #${quoteId}: ${targetQuote.serviceType}`, amount: totalAmount },
              { description: 'Texas Sales Tax (8.25%)', amount: tax }
            ]
          };

          return {
            quotes: updatedQuotes,
            orders: [newOrder, ...s.orders],
            invoices: [newInvoice, ...s.invoices],
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `✅ Quote #${quoteId} Approved & Scheduled!`,
                body: `Job #${orderId} has been added to your upcoming services. Invoice #${invId} created.`,
                type: 'quote',
                time: 'Just now',
                read: false,
              },
              ...s.notifications
            ]
          };
        });
      },

      declineQuote: (quoteId) => {
        set(s => ({
          quotes: s.quotes.map(q => q.id === quoteId ? { ...q, status: 'declined' } : q),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `Quotation #${quoteId} Declined`,
              body: `Quote #${quoteId} has been declined. You can request a new quote anytime.`,
              type: 'quote',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
      },

      // INVOICE & PAYMENT ACTIONS
      payInvoice: (invoiceId, paymentDetails) => {
        set(s => {
          const inv = s.invoices.find(i => i.id === invoiceId);
          if (!inv) return s;

          const updatedInvoices = s.invoices.map(i => i.id === invoiceId ? {
            ...i,
            status: 'paid',
            paidAt: new Date().toISOString(),
            paymentMethod: paymentDetails.method || 'Credit Card'
          } : i);

          // If linked to order, mark payment as paid in booking
          const updatedOrders = s.orders.map(o => o.id === inv.orderId ? {
            ...o,
            booking: { ...o.booking, paymentMethod: `Paid via ${paymentDetails.method || 'Card'}` }
          } : o);

          return {
            invoices: updatedInvoices,
            orders: updatedOrders,
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `💳 Payment Received for Invoice #${invoiceId}`,
                body: `Payment of $${inv.total.toFixed(2)} processed successfully. Receipt is available in your invoices portal.`,
                type: 'payment',
                time: 'Just now',
                read: false,
              },
              ...s.notifications
            ]
          };
        });
      },

      // COMPLAINT / SUPPORT ACTIONS
      submitComplaint: (data) => {
        const ticketId = `TKT-${Math.floor(100 + Math.random() * 900)}`;
        const newTicket = {
          id: ticketId,
          orderId: data.orderId || 'General',
          customerId: data.customerId || 'c1',
          customerName: data.customerName || 'Sarah Connor',
          category: data.category || 'other',
          subject: data.subject,
          description: data.description,
          priority: data.priority || 'medium',
          status: 'open',
          createdAt: new Date().toISOString(),
          updates: [
            { time: new Date().toISOString(), text: 'Support request ticket submitted.' }
          ]
        };

        set(s => ({
          complaints: [newTicket, ...s.complaints],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `🎧 Support Ticket #${ticketId} Created`,
              body: `Our Dallas customer resolution team has received your ticket regarding "${data.subject}".`,
              type: 'support',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
        return newTicket;
      },

      // REVIEW ACTIONS
      submitReview: (data) => {
        const revId = `REV-${Math.floor(100 + Math.random() * 900)}`;
        const newReview = {
          id: revId,
          orderId: data.orderId,
          customerId: data.customerId || 'c1',
          customerName: data.customerName || 'Sarah Connor',
          workerId: data.workerId || 'w1',
          workerName: data.workerName || 'Dallas Certified Pro',
          rating: data.rating || 5,
          qualityRating: data.qualityRating || 5,
          punctualityRating: data.punctualityRating || 5,
          comment: data.comment || '',
          tipAmount: data.tipAmount || 0,
          createdAt: new Date().toISOString(),
        };

        set(s => ({
          reviews: [newReview, ...s.reviews],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `⭐ Thank You For Your Review!`,
              body: `Your ${data.rating}-star review for order #${data.orderId} was recorded.`,
              type: 'review',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
        return newReview;
      },

      // WORKER JOB EXECUTION ACTIONS
      jobProgress: {},

      getJobProgress: (orderId) => {
        if (!orderId) return DEFAULT_JOB_PROGRESS;
        return get().jobProgress[orderId] || DEFAULT_JOB_PROGRESS;
      },

      checkInJob: (orderId) => {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const updatedProgress = { ...current, checkedInAt: nowStr };

          // Also advance order status to active / stage 1 if stage 0
          const updatedOrders = s.orders.map(o => o.id === orderId ? {
            ...o,
            stage: Math.max(o.stage, 1),
            status: 'active'
          } : o);

          return {
            jobProgress: { ...s.jobProgress, [orderId]: updatedProgress },
            orders: updatedOrders,
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `⏱️ Pro Checked In: #${orderId}`,
                body: `Dallas Pro has checked in at location at ${nowStr}. Cleaning in progress.`,
                type: 'worker',
                time: 'Just now',
                read: false
              },
              ...s.notifications
            ]
          };
        });
      },

      checkOutJob: (orderId) => {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const updatedProgress = { ...current, checkedOutAt: nowStr };

          return {
            jobProgress: { ...s.jobProgress, [orderId]: updatedProgress }
          };
        });
      },

      toggleChecklistItem: (orderId, itemId) => {
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const updatedChecklist = current.checklist.map(item =>
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          return {
            jobProgress: {
              ...s.jobProgress,
              [orderId]: { ...current, checklist: updatedChecklist }
            }
          };
        });
      },

      addJobPhoto: (orderId, photoType, photoUrl) => {
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const key = photoType === 'before' ? 'beforePhotos' : 'afterPhotos';
          const updatedPhotos = [...current[key], photoUrl];

          return {
            jobProgress: {
              ...s.jobProgress,
              [orderId]: { ...current, [key]: updatedPhotos }
            }
          };
        });
      },

      reportWorkerProblem: (orderId, problemData) => {
        const ticketId = `PRB-${Math.floor(100 + Math.random() * 900)}`;
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const newReport = {
            id: ticketId,
            orderId,
            category: problemData.category,
            description: problemData.description,
            photo: problemData.photo || null,
            reportedAt: new Date().toISOString(),
          };

          return {
            jobProgress: {
              ...s.jobProgress,
              [orderId]: { ...current, problemReports: [newReport, ...(current.problemReports || [])] }
            },
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `⚠️ On-Site Problem Reported: #${orderId}`,
                body: `Worker reported issue (${problemData.category}): ${problemData.description}`,
                type: 'support',
                time: 'Just now',
                read: false
              },
              ...s.notifications
            ]
          };
        });
      },

      submitJobCompletionReport: (orderId, reportData) => {
        set(s => {
          const current = s.jobProgress[orderId] || get().getJobProgress(orderId);
          const finalReport = {
            completedAt: new Date().toISOString(),
            notes: reportData.notes,
            satisfactionConfirmed: reportData.satisfactionConfirmed,
            lockUpConfirmed: reportData.lockUpConfirmed,
          };

          const updatedOrders = s.orders.map(o => o.id === orderId ? {
            ...o,
            stage: o.stages.length - 1,
            status: 'completed'
          } : o);

          return {
            jobProgress: {
              ...s.jobProgress,
              [orderId]: { ...current, completionReport: finalReport }
            },
            orders: updatedOrders,
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: `🎉 Job Completed & Report Submitted: #${orderId}`,
                body: `Service booking #${orderId} has been completed and verified by your Dallas Pro.`,
                type: 'order',
                time: 'Just now',
                read: false
              },
              ...s.notifications
            ]
          };
        });
      },

      // ADMIN DATA COLLECTIONS & ACTIONS
      leads: [
        {
          id: 'LD-901',
          name: 'Mark Davis',
          company: 'Plano Tech Center Suite 300',
          email: 'mark@planotech.com',
          phone: '(214) 555-0841',
          serviceNeeded: 'Commercial Office Sanitation',
          propertySize: '5,000 sq ft',
          status: 'new',
          estimatedValue: 650,
          createdAt: '2026-09-02T08:00:00Z',
        },
        {
          id: 'LD-889',
          name: 'Amanda Vance',
          company: 'Uptown Dallas Luxury Loft',
          email: 'amanda.v@gmail.com',
          phone: '(214) 555-9012',
          serviceNeeded: 'Move-In Deep Clean & Detail',
          propertySize: '2,200 sq ft',
          status: 'quoted',
          estimatedValue: 280,
          createdAt: '2026-09-01T15:20:00Z',
        }
      ],

      contracts: [
        {
          id: 'CTR-401',
          customerName: 'Dallas Corporate HQ',
          companyName: 'Apex Financial Center',
          serviceType: 'Daily Commercial Janitorial & Sanitation',
          frequency: 'Daily (Mon-Fri)',
          monthlyValue: 3400.00,
          startDate: '2026-01-15',
          endDate: '2027-01-15',
          status: 'active',
          autoRenew: true,
        },
        {
          id: 'CTR-388',
          customerName: 'Sarah Connor (Residential VIP)',
          companyName: 'Preston Hollow Estate',
          serviceType: 'Bi-Weekly Deep Clean & Laundry',
          frequency: 'Bi-Weekly',
          monthlyValue: 560.00,
          startDate: '2026-03-01',
          endDate: '2026-09-01',
          status: 'active',
          autoRenew: true,
        }
      ],

      expenses: [
        { id: 'EXP-101', category: 'supplies', amount: 320.00, description: 'Eco Sanitation Chemicals & Microfiber Mops Batch #4', date: '2026-09-01' },
        { id: 'EXP-102', category: 'payouts', amount: 1450.00, description: 'Bi-Weekly Worker Earnings Distribution (John Miller & David Smith)', date: '2026-08-30' },
        { id: 'EXP-103', category: 'marketing', amount: 450.00, description: 'Dallas Metro Local Google Ads & Promo DALLAS15 Campaign', date: '2026-08-28' },
        { id: 'EXP-104', category: 'equipment', amount: 280.00, description: 'Commercial HEPA Carpet Vacuum Replacement Filters', date: '2026-08-25' },
      ],

      createAdminLead: (data) => {
        const leadId = `LD-${Math.floor(100 + Math.random() * 900)}`;
        const newLead = {
          id: leadId,
          name: data.name,
          company: data.company || 'Dallas Client',
          email: data.email || 'lead@example.com',
          phone: data.phone || '(214) 555-0000',
          serviceNeeded: data.serviceNeeded || 'General Cleaning',
          propertySize: data.propertySize || '2,000 sq ft',
          status: 'new',
          estimatedValue: Number(data.estimatedValue) || 200,
          createdAt: new Date().toISOString(),
        };

        set(s => ({
          leads: [newLead, ...s.leads],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `🎯 New Sales Lead Captured (#${leadId})`,
              body: `Lead from ${data.name} for ${data.serviceNeeded} ($${newLead.estimatedValue}).`,
              type: 'admin',
              time: 'Just now',
              read: false
            },
            ...s.notifications
          ]
        }));
        return newLead;
      },

      updateLeadStatus: (leadId, newStatus) => {
        set(s => ({
          leads: s.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
        }));
      },

      createContract: (data) => {
        const ctrId = `CTR-${Math.floor(100 + Math.random() * 900)}`;
        const newContract = {
          id: ctrId,
          customerName: data.customerName,
          companyName: data.companyName || 'Dallas Client',
          serviceType: data.serviceType,
          frequency: data.frequency || 'Monthly',
          monthlyValue: Number(data.monthlyValue) || 500,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          endDate: data.endDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          status: 'active',
          autoRenew: true,
        };

        set(s => ({
          contracts: [newContract, ...s.contracts],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `📜 Commercial Contract Executed (#${ctrId})`,
              body: `Contract for ${data.customerName} set at $${newContract.monthlyValue}/mo.`,
              type: 'admin',
              time: 'Just now',
              read: false
            },
            ...s.notifications
          ]
        }));
        return newContract;
      },

      addExpense: (data) => {
        const expId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
        const newExp = {
          id: expId,
          category: data.category || 'supplies',
          amount: Number(data.amount) || 50,
          description: data.description,
          date: data.date || new Date().toISOString().split('T')[0],
        };

        set(s => ({
          expenses: [newExp, ...s.expenses]
        }));
        return newExp;
      },

      issueAdminQuotePrice: (quoteId, priceDetails) => {
        set(s => ({
          quotes: s.quotes.map(q => q.id === quoteId ? {
            ...q,
            status: 'quoted',
            validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            priceDetails: {
              basePrice: priceDetails.basePrice,
              additions: priceDetails.additions || [],
              discount: priceDetails.discount || 0,
              tax: priceDetails.tax || 0,
              total: priceDetails.total,
              estimatedHours: priceDetails.estimatedHours || '3-4 hours',
              recommendedPros: priceDetails.recommendedPros || 'Dallas Master Crew'
            }
          } : q),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `📄 Quote #${quoteId} Proposal Sent!`,
              body: `Itemized quote of $${priceDetails.total} issued to customer.`,
              type: 'quote',
              time: 'Just now',
              read: false
            },
            ...s.notifications
          ]
        }));
      },

      resolveComplaintAdmin: (ticketId, resolutionText) => {
        set(s => ({
          complaints: s.complaints.map(c => c.id === ticketId ? {
            ...c,
            status: 'resolved',
            updates: [
              ...(c.updates || []),
              { time: new Date().toISOString(), text: `Resolved by Operations Manager: ${resolutionText}` }
            ]
          } : c),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `✅ Support Ticket #${ticketId} Resolved`,
              body: `Resolution notes added by admin manager.`,
              type: 'support',
              time: 'Just now',
              read: false
            },
            ...s.notifications
          ]
        }));
      },

      getOrdersByCustomer: (customerId) => get().orders.filter(o => o.customer?.id === customerId),
      getOrdersByWorker: (workerId) => get().orders.filter(o => o.operator?.id === workerId),
      getPendingOrders: () => get().orders.filter(o => o.status === 'pending'),
    }),
    { name: 'cleanamerica-orders-v7', version: 7 }
  )
);



