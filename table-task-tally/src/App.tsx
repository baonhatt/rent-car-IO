import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./components/Cart";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              isAuthenticated() ? <Navigate to="/todo" replace /> : <Login />
            } />
            <Route path="/signup" element={
              isAuthenticated() ? <Navigate to="/todo" replace /> : <Signup />
            } />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/todo" element={<Index />} />
              <Route path="/todo/cart" element={<Cart />} />
            </Route>

            {/* Default route */}
            <Route path="/" element={
              isAuthenticated() ? <Navigate to="/todo" replace /> : <Navigate to="/login" replace />
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
