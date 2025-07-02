import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAppSelector, type RootState } from "../store";
import { AuthRedirect } from "./AuthRedirect";
import { ProtectedRoute } from "./ProtectedRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { OrganizerRoutes } from "./OrganizerRoutes";
import { LazyLoadingScreen } from "../components/partials/LazyLoadingScreen";


const Login = lazy(() => import("../pages/user/Login"));
const SignUp = lazy(() => import("../pages/user/SignUp"));
const AboutPage = lazy(() => import("../pages/user/AboutPage"));
const ForgotPassword = lazy(() => import("../pages/user/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/user/ResetPassword"));
const OtpPage = lazy(() => import("../pages/user/OtpPage"));
const Home = lazy(() => import("../pages/user/Home"));
const BrowsePage = lazy(() => import("../pages/user/BrowsePage"));
const BookingPage = lazy(() => import("../pages/user/BookingPage"));
const EventDetailPage = lazy(() => import("../pages/user/EventDetailPage"));
const ConfirmationPage = lazy(() => import("../pages/user/ConfirmationPage"));
const TicketsPage = lazy(() => import("../pages/user/TicketsPage"));
const VideoConferencePage = lazy(() => import("../pages/user/VideoConferencePage"));
const NotificationsPage = lazy(() => import("../pages/user/NotificationsPage"));
const MeetingLandingPage = lazy(() => import("../pages/user/MeetingLandingPage"));

const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const RequestOrganizer = lazy(() => import("../pages/profile/RequestOrganizer"));
const MyTickets = lazy(() => import("../pages/profile/MyTickets"));
const Wallet = lazy(() => import("../pages/profile/Wallet"));
const SavedEvents = lazy(() => import("../pages/profile/SavedEvents"));
const UserMessages = lazy(() => import("../pages/profile/UserMessages"));
const OrganizerProfile = lazy(() => import("../pages/organizer/OrganizerProfile"));
const OrganizerBooking = lazy(() => import("../pages/organizer/Bookings"));

const EventPage = lazy(() => import("../pages/organizer/EventPage"));
const CreateEvent = lazy(() => import("../pages/organizer/CreateEvent"));
const EditEvent = lazy(() => import("../pages/organizer/EditEvent"));
const CreateTicket = lazy(() => import("../pages/organizer/CreateTicket"));
const EditTicket = lazy(() => import("../pages/organizer/EditTicket"));
const FeatureRequestPage = lazy(() => import("../pages/organizer/FeatureRequestPage"));
const OrganizerDashboard = lazy(() => import("../pages/organizer/OrganizerDashboard"));
const OrganizerAnalytics = lazy(() => import("../pages/organizer/OrganizerAnalytics"));

const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const OrganizerRequests = lazy(() => import("../pages/admin/OrganizerRequests"));
const OrganizerRequestDetailsPage = lazy(() => import("../pages/admin/OrganizerRequestDetailsPage"));
const CategoryPage = lazy(() => import("../pages/admin/CategoryPage"));
const CreateCategory = lazy(() => import("../pages/admin/CreateCategory"));
const EditCategory = lazy(() => import("../pages/admin/EditCategory"));
const CouponPage = lazy(() => import("../pages/admin/CouponPage"));
const CreateCoupon = lazy(() => import("../pages/admin/CreateCoupon"));
const EditCoupon = lazy(() => import("../pages/admin/EditCoupon"));
const FeatureRequestAdmin = lazy(() => import("../pages/admin/FeatureRequestAdmin"));
const UserReportsPage = lazy(() => import("../pages/admin/UserReportsPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics"));

const AppRoutes = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);

    return (
        <Suspense fallback={<LazyLoadingScreen />}>
            <Routes>
                <Route path="/about" element={<AboutPage />} />
                <Route element={<AuthRedirect user={user} />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:id" element={<ResetPassword />} />
                    <Route path="/otp-verification" element={!user?.isVerified ? <OtpPage /> : <Navigate to="/login" />} />
                </Route>

                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/events/browse" element={<BrowsePage />} />
                    <Route path="/event/bookings/:id" element={<BookingPage />} />
                    <Route path="/event/:id" element={<EventDetailPage />} />
                    <Route path="/payment/:id" element={<ConfirmationPage />} />
                    <Route path="/account/profile" element={<ProfilePage />} />
                    <Route path="/account/request-organizer-form" element={<RequestOrganizer />} />
                    <Route path="/account/tickets" element={<MyTickets />} />
                    <Route path="/account/wallet" element={<Wallet />} />
                    <Route path="/account/saved-events" element={<SavedEvents />} />
                    <Route path="/messages" element={<UserMessages />} />
                    <Route path="/booking/:id" element={<TicketsPage />} />
                    <Route path="/profile/:id" element={<OrganizerProfile />} />
                    <Route path="/meeting/:id" element={<VideoConferencePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/landing/:id" element={<MeetingLandingPage />} />
                </Route>

                <Route element={<OrganizerRoutes user={user} />}>
                    <Route path="/organizer/events" element={<EventPage />} />
                    <Route path="/organizer/create-event" element={<CreateEvent />} />
                    <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
                    <Route path="/organizer/create-ticket/:id" element={<CreateTicket />} />
                    <Route path="/organizer/edit-ticket/:id" element={<EditTicket />} />
                    <Route path="/organizer/bookings" element={<OrganizerBooking />} />
                    <Route path="/organizer/request-a-feature" element={<FeatureRequestPage />} />
                    <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                    <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
                </Route>

                <Route element={<AdminRoutes user={user} />}>
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/organizer-requests" element={<OrganizerRequests />} />
                    <Route path="/admin/organizer-requests/:id" element={<OrganizerRequestDetailsPage />} />
                    <Route path="/admin/categories" element={<CategoryPage />} />
                    <Route path="/admin/create-category" element={<CreateCategory />} />
                    <Route path="/admin/edit-category/:id" element={<EditCategory />} />
                    <Route path="/admin/coupons" element={<CouponPage />} />
                    <Route path="/admin/create-coupon" element={<CreateCoupon />} />
                    <Route path="/admin/edit-coupon/:id" element={<EditCoupon />} />
                    <Route path="/admin/feature-request" element={<FeatureRequestAdmin />} />
                    <Route path="/admin/user-reports" element={<UserReportsPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
