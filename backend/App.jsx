import { RouterProvider } from "react-router-dom";
import AppRouterGenerate from "./pages/Router";
import { Provider } from 'react-redux'
import { store } from "./redux/store";
import ErrorPage from "./pages/errorPage";
import { ErrorBoundary } from "react-error-boundary";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const App = () => {
    const logError = (error) => {
        console.error(error);
    };
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
    return (
        <>
            <ErrorBoundary FallbackComponent={<ErrorPage />} onError={logError}>
                <Elements stripe={stripePromise}>
                    <Provider store={store}>
                        <RouterProvider basename="" router={AppRouterGenerate()} />
                    </Provider>
                </Elements>
            </ErrorBoundary >
        </>
    );
}
export { App }