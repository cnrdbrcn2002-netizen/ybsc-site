import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: '#000',
                    color: '#ff0033',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    padding: '20px',
                    zIndex: 99999
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>SYSTEM CRITICAL FAILURE</h1>
                    <div style={{ border: '1px solid #ff0033', padding: '20px', maxWidth: '800px', background: 'rgba(255,0,51,0.1)' }}>
                        <h3 style={{ borderBottom: '1px solid #ff0033', paddingBottom: '10px' }}>ERROR_LOG:</h3>
                        <pre style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <br />
                        <details style={{ cursor: 'pointer', color: '#aaa' }}>
                            <summary>STACK_TRACE (Click to expand)</summary>
                            <pre style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '40px',
                            background: '#ff0033',
                            color: '#000',
                            border: 'none',
                            padding: '15px 40px',
                            fontFamily: 'monospace',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        SYSTEM_REBOOT
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
