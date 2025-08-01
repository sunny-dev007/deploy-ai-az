import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';

const ProtectedRoute = ({ children }) => {
    const { instance, accounts, inProgress } = useMsal();
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    
    useEffect(() => {
        const validateAccess = async () => {
            try {
                // NEW: Check for bypass mode first
                const bypassMode = sessionStorage.getItem('bypass_auth');
                if (bypassMode === 'true') {
                    console.log("Bypass mode detected - allowing access without authentication");
                    setIsTokenValid(true);
                    setIsValidatingToken(false);
                    return;
                }

                // If MSAL is still initializing or performing another operation, wait
                if (inProgress !== "none") {
                    console.log("MSAL operation in progress:", inProgress);
                    return; // Don't do anything yet, wait for the next state update
                }
                
                if (accounts.length === 0) {
                    console.log("No accounts found, authentication required");
                    setIsTokenValid(false);
                    setIsValidatingToken(false);
                    return;
                }
                
                // Only try to acquire token if we have accounts and MSAL is ready
                try {
                    console.log("Attempting token validation for account:", accounts[0].username);
                    await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0]
                    });
                    
                    setIsTokenValid(true);
                    console.log("Token validated successfully");
                } catch (error) {
                    console.error("Token validation failed:", error);
                    setIsTokenValid(false);
                    
                    // If interaction is required, redirect to login
                    if (error instanceof InteractionRequiredAuthError) {
                        console.log("Interactive authentication required");
                    }
                }
            } finally {
                setIsValidatingToken(false);
            }
        };
        
        validateAccess();
    }, [accounts, instance, inProgress]);
    
    // Show loading state while validating token or if MSAL is busy
    if (isValidatingToken || inProgress !== "none") {
        return <div className="auth-loading">Verifying authentication...</div>;
    }

    // Check bypass mode again for final decision
    const bypassMode = sessionStorage.getItem('bypass_auth');
    
    // Allow access if either authenticated normally OR in bypass mode
    if ((accounts.length > 0 && isTokenValid) || bypassMode === 'true') {
        if (bypassMode === 'true') {
            console.log("ProtectedRoute - Bypass mode active, rendering protected content");
        } else {
            console.log("ProtectedRoute - User authenticated normally, rendering protected content");
        }
        return children;
    }
    
    // Redirect to login if no accounts or token is invalid AND not in bypass mode
    console.log("ProtectedRoute - Authentication required, redirecting to login");
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute; 