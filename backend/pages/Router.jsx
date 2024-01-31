
import { createBrowserRouter } from "react-router-dom";
import Login from "src/pages/auth/login/page";
import Home from "src/pages/page";
import ToastContextContextProvider from "../lib/context/toastContext";
import SignupPage from "src/pages/auth/signup/page";
import LoginAdminPage from "src/pages/auth/loginAdmin/page";
import LoginBackOfficePage from "src/pages/auth/loginBackoffice/page";
import SignupBackOfficePage from "src/pages/auth/signupBackoffice/page";
import AppWelcomePage from "src/pages/app/welcome";
import BackofficePage from "src/pages/app/Admin/manage-backoffice/page";
import ProfilePage from "src/pages/app/profile/ProfilePage";
import StudentPage from "src/pages/app/Admin/manage-students/page";
import ErrorPage from "src/pages/errorPage";
import AllQuestionPage from "src/pages/app/Admin/manage-questions/all-question";
import CreateQuestionPage from "src/pages/app/Admin/manage-questions/create-question";
import EditQuestionPage from "src/pages/app/Admin/manage-questions/edit-question";
import RedirectPage from "src/pages/redirect/page";
import QuestionStatusPage from "./app/Admin/manage-questions/status-question";
import LessonPage from "./app/Admin/manage-courses/page";
import TestPage from "./app/User/Tests/ListExamsAndTestsPage";
import AttemptPage from "./app/User/Tests/AttemptPage";
import ResultPage from "./app/User/Tests/ResultPage";
import { PricingPage } from "./app/User/Payment/Pricing";
import CoursePage from "./app/User/courses/page";
import { ManagePackagePage } from "./app/Admin/manage-packages/page";
import  { RecordPage } from "./app/User/Tests/RecordPage";
import VerifyPage from "./auth/verify/page";

// these routes are NOT ENFORCED FOR EACH ROLE
const getRoutesList = () => {
    let routesUploader = [
        {
            path: "welcome",
            element: <AppWelcomePage />,
        },
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: "manage-questions",
            children: [
                {
                    path: "list",
                    element: <AllQuestionPage />,
                },
                {
                    path: "create",
                    element: <CreateQuestionPage />,
                },
                {
                    path: "edit",
                    element: <EditQuestionPage />,
                },
                {
                    path: "status",
                    element: <QuestionStatusPage />,
                }
            ]
        },
        {
            path: "manage-courses",
            element: <LessonPage />,
        },
        {
            path: "manage-package",
            element: <ManagePackagePage />,
        },
        {
            path: "pricing",
            element: <PricingPage />,
        }
    ]
    let routesReviewer = [
        ...routesUploader
    ]
    let routesTeacher = [
        ...routesReviewer,
        {
            path: "manage-students",
            element: <StudentPage />,
        },
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: "manage-backoffice",
            element: <BackofficePage />,
        },
    ];
    let routesStudent = [
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: "welcome",
            element: <AppWelcomePage />,
        },
        {
            path: "pricing",
            element: <PricingPage />,
        },
        {
            path: "courses",
            element: <CoursePage />,
        },
        {
            path: "tests",
            // element: <TestPage />,
            children: [
                {
                    path: "",
                    element: <TestPage />,
                },
                {
                    path: "list",
                    element: <TestPage />,
                },
                {
                    path: "history",
                    element: <RecordPage />,
                },
                {
                    path: "attempt/:id",
                    element: <AttemptPage />,
                },
                {
                    path: "result/:id",
                    element: <ResultPage />,
                },
            ]
        },
    ]
    let routesParent = [
        ...routesStudent,
    ]
    let routesAdmin = [
        ...routesTeacher,
        ...routesStudent
    ]
    return [
        ...routesAdmin,
        ...routesParent,
        ...routesStudent,
        ...routesTeacher,
        ...routesUploader,
        ...routesReviewer,
    ];
}


const AppRouterGenerate = () => {
    return createBrowserRouter([
        {
            errorElement: <ErrorPage />,
            element: <ToastContextContextProvider />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "error",
                    element: <ErrorPage />,
                },
                {
                    path: "redirect",
                    element: <RedirectPage />
                },
                {
                    path: "auth",
                    errorElement: <ErrorPage />,
                    children: [
                        {
                            path: "login",
                            element: <Login />,
                        },
                        {
                            path: "signup",
                            element: <SignupPage />,
                        },
                        {
                            path: "loginAdmin",
                            element: <LoginAdminPage />,
                        },
                        {
                            path: "verify",
                            element: <VerifyPage />,
                        },
                        {
                            path: "loginBackoffice",
                            element: <LoginBackOfficePage />,
                        },
                                {
                                    path: "signupBackoffice",
                                    element: <SignupBackOfficePage />,
                                }
                            ]
                        },
                {
                    path: "app",
                    children: [
                        ...getRoutesList(),
                    ]
                }
            ]
        }

    ])
}

export default AppRouterGenerate;