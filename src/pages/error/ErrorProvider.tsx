/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from "react";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import ErrorPage from "./Error";

class ErrorBoundary extends React.Component {
    // eslint-disable-next-line react/state-in-constructor
    state = { hasError: false };


    componentDidCatch(error: unknown) {
        console.error(error);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state.hasError) {
            return (
                <ErrorPage errorCode={ErrorCodeEnum.COMMON} atInit={true} />
            );
        }

        // @ts-expect-error - children is a prop
        // eslint-disable-next-line react/prop-types, react/destructuring-assignment
        return this.props.children;
    }
}




export default ErrorBoundary;