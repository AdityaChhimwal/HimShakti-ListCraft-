import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">

            <h1 className="text-3xl font-bold text-red-600">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-600">
              Please refresh the page and try again.
            </p>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;