export const baseURL = import.meta.env.VITE_API_BASE_URL;

const SummaryApi = {
  // Auth APIs
  register: { url: "/auth/register", method: "post" },
  login: { url: "/auth/login", method: "post" },
  googleLogin: { url: "/auth/google-login", method: "post" },
  forgot_password: (email: string) => ({
    url: `/auth/forgot-password/${email}`,
    method: "post",
  }),
  verify_forgot_otp: { url: "/auth/verify-otp", method: "post" },
  reset_password: { url: "/auth/reset-password", method: "put" },
  verifyEmail: (token: string) => ({ url: `/auth/verify-email/${token}`, method: "post" }),

  // User APIs
  login_user: { url: "/user/me", method: "get" },
  logout: { url: "/user/logout", method: "post" },
  get_all_users: { url: "/user/allusers", method: "get" },
  role_change: { url: "/user/role-change", method: "put" },
  delete_user: { url: "/user/delete", method: "delete" },
  status_change: { url: "/user/status-change", method: "put" },
  update_profile: { url: "/user/update", method: "put" },

  // Event APIs
  create_event: { url: "/event/create", method: "post" },
  update_event: (id: string) => ({ url: `/event/update/${id}`, method: "put" }),
  delete_event: (id: string) => ({ url: `/event/delete/${id}`, method: "delete" }),
  toggle_event: (id: string) => ({ url: `/event/toggle-active/${id}`, method: "patch" }),
  get_all_events: { url: "/event/getAll", method: "get" },
  get_all_events_calendar: { url: "/event/calendar", method: "get" },
  get_event_by_id: (id: string) => ({ url: `/event/getById/${id}`, method: "get" }),
  search_events: { url: "/event/search", method: "get" },
  get_all_my_events:{ url: "/event/my", method: "get" },

  // Admin APIs
  admin_stats: { url: "/admin/stats", method: "get" },
  admin_logs: { url: "/admin/logs", method: "get" },
  admin_event_chart: { url: "/admin/event-chart", method: "get" },
  admin_scan_chart: { url: "/admin/scan-chart", method: "get" },

 // Organizer Dashboard
  organizer_stats: { url: "/organizer/stats", method: "get" },
  organizer_event_chart: { url: "/organizer/event-chart", method: "get" },
  organizer_earnings: { url: "/organizer/earnings", method: "get" },
  organizer_daily_revenue: { url: "/organizer/daily-revenue", method: "get" },
  organizer_monthly_revenue: { url: "/organizer/monthly-revenue", method: "get" },
  organizer_summary: { url: "/organizer/earning-summary", method: "get" },

  // ✅ FIXED WALLET
  organizer_wallet: { url: "/organizer/wallet", method: "get" },

  // ✅ FIXED WITHDRAW
  withdraw_request: { url: "/organizer/withdraw", method: "post" },
  withdraw_list: { url: "/organizer/withdrawals", method: "get" },

  // Admin
  admin_withdraw_list: { url: "/admin/withdrawals", method: "get" },
  admin_approve_withdraw: (id: string) => ({
    url: `/admin/approve-withdraw/${id}`,
    method: "patch",
  }),

admin_daily_revenue: { url: "/admin/daily-revenue", method: "get" },
admin_monthly_revenue: { url: "/admin/monthly-revenue", method: "get" },


admin_notifications:       { url: "/notifications/admin",            method: "GET" },
my_notifications:          { url: "/notifications/my",               method: "GET" },
admin_unread_count:        { url: "/notifications/admin/unread-count", method: "GET" },
my_unread_count:           { url: "/notifications/unread-count",     method: "GET" },
mark_notification_read: (id: string) => ({ url: `/notifications/read/${id}`, method: "PATCH" }),

get_my_tickets:{
  url:"/bookings/my-tickets",
  method:"get"
}
};


export default SummaryApi;