const BASE_URL = "https://collageevent.onrender.com";
// AUTH
export const StudentRegsiterApi = `${BASE_URL}/api/Auth/student/register`;
export const StudentLogin = `${BASE_URL}/api/Auth/student/login`;

// ADMIN
export const AdminEvent = `${BASE_URL}/api/admin/events`;
export const AdminEventCatogry = `${BASE_URL}/api/admin/events/categories`;
export const AdminEventState = `${BASE_URL}/api/admin/events/stats`;

// EVENT DETAILS
export const EventDetailsPageSports = `${BASE_URL}/api/events/sports`;
export const EventDetailsPageHackathon = `${BASE_URL}/api/events/hackathon`;
export const EventDetailsPageCutural = `${BASE_URL}/api/events/cultural`;
export const EventDetailsPageWorkshop = `${BASE_URL}/api/events/workshops`;
export const EventDetailsPageSeminar = `${BASE_URL}/api/events/seminars`;
export const EventDetailsPageStartup = `${BASE_URL}/api/events/startup`;
export const EventDetailsPageSimilar = `${BASE_URL}/api/events/similar`;
export const EventDetailsPageRegister = `${BASE_URL}/api/events/register`;

// UPCOMING EVENTS
export const EventUpcommingSport = `${BASE_URL}/api/Event/ESports/getAllsports`;
export const EventUpcommingHackaThon = `${BASE_URL}/api/event/hackathon/getallhackthon`;
export const EventUpcommingCutural = `${BASE_URL}/api/event/CuturalEvent/GetCuturalEvent`;
export const EventUpcommingSeminar = `${BASE_URL}/api/event/seminar/getseminar`;
export const EventUpcommingWorkshop = `${BASE_URL}/api/workshope/event/getworkshop`;
export const EventUpcommingWorkstartup = `${BASE_URL}/api/startup/event/getAllIdeas`;

// CREATE EVENTS
export const CreateEventHackathon = `${BASE_URL}/api/event/hackathon/createhackathon`;
export const CreateEventSeminar = `${BASE_URL}/api/event/seminar/createseminar`;
export const CreateEventSport = `${BASE_URL}/api/Event/ESports/createsport`;

// GET BY ID
export const ByEventIdSport = `${BASE_URL}/api/Event/ESports/getSportByEventid`;
export const ByEventIdSeminar = `${BASE_URL}/api/event/seminar/getseminarid`;
export const ByEventIdStartup = `${BASE_URL}/api/startup/event/getIdeasbyid`;
export const ByEventIdWorkShpo = `${BASE_URL}/api/workshope/event/workshop`;
export const ByEventIdHackathone = `${BASE_URL}/api/event/hackathon/gethanckthonbyId`;
export const ByEventIdCutural = `${BASE_URL}/api/event/CuturalEvent/getCuturalById`;

// RAZORPAY (SAFE)
export const RazorpayApiInstanceVerify =
    `${BASE_URL}/api/account/razorpay/verify-payment`;


export const RazorpayApiInstance = `${BASE_URL}/api/account/razorpay/create-order`

export const RazorpayApiInstanceHistory = `${BASE_URL}/api/account/razorpay/historypayment`;




// Admin Register pages and other Routers 
export const AdminRegsiter = `${BASE_URL}/api/account/AdminRouter/AdminCreateAccount`
export const AdminLogin = `${BASE_URL}/api/account/AdminRouter/AdminLogin`
export const AdminLogOut = `${BASE_URL}/api/account/AdminRouter/AdminLogOut`



// Oraginser  Register pages and other Routers 
export const OrgainserRegsiter = `${BASE_URL}/api/account/OrgainserRouter/OrganiserCreateAccount`
export const OrgainserLogin = `${BASE_URL}/api/account/OrgainserRouter/OrgainserLogin`
export const OrgainserLogout = `${BASE_URL}/api/account/OrgainserRouter/OrganiserLogOut`






//   Team member Api 

export const TeamMember = `${BASE_URL}/api/teammember/getAllTeammember`







