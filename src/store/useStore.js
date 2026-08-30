import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ORDER_STAGES = ['Confirmed', 'Pro Assigned', 'En Route', 'Service In Progress', 'Completed'];
let _counter = 0;

const DEFAULT_NOTIFICATIONS = [
  { id: 'n1', title: '🎉 Welcome to Clean America Dallas', body: 'Book certified Dallas pros with instant 100% satisfaction guarantee', time: 'Just now', read: false, type: 'welcome' },
  { id: 'n2', title: '🏷️ Dallas Special Discount', body: 'Use promo code DALLAS15 at checkout for 15% OFF your booking', time: '5m ago', read: false, type: 'promo' }
];

export const useStore = create(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,
      cart: [],
      notifications: DEFAULT_NOTIFICATIONS,

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
        };
        
        set(s => ({
          orders: [order, ...s.orders],
          activeOrder: order,
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `🎉 Booking #${orderId} Confirmed!`,
              body: `Scheduled for ${vehicle.name} at ${booking.location || 'Dallas, TX'}.`,
              type: 'order',
              time: 'Just now',
              read: false,
            },
            ...s.notifications
          ]
        }));
        return order;
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

      getOrdersByCustomer: (customerId) => get().orders.filter(o => o.customer?.id === customerId),
      getOrdersByWorker: (workerId) => get().orders.filter(o => o.operator?.id === workerId),
      getPendingOrders: () => get().orders.filter(o => o.status === 'pending'),
    }),
    { name: 'cleanamerica-orders' }
  )
);
