import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Navbar from "./Navbar";

const ErrorPage = () => {
    const error = useRouteError();
    return (
        <>
            <Navbar />
            <div className="p-4">
                <h1>Oops...</h1>
                <p>
                    Sorry,{" "}
                    {isRouteErrorResponse(error)
                        ? "This page does not exists"
                        : "an unexpected error has occurred"}
                </p>
            </div>
        </>
    );
};

export default ErrorPage;
