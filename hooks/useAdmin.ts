"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { AdminPredictionRecord } from "@/services";

export function useAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<AdminPredictionRecord[]>([]);
  const [verifiedPredictions, setVerifiedPredictions] = useState<AdminPredictionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync Supabase Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUsername(session.user.email || "Admin");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUsername(session.user.email || "Admin");
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all predictions and verified predictions from Supabase
  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch raw predictions
      const { data: rawList, error: rawError } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);

      if (rawError) throw rawError;

      // 2. Fetch verified predictions sheet
      const { data: verifiedList, error: verifiedError } = await supabase
        .from("verified_predictions")
        .select("*")
        .order("verified_at", { ascending: false })
        .limit(60);

      if (verifiedError) throw verifiedError;

      setPredictions((rawList as AdminPredictionRecord[]) || []);
      setVerifiedPredictions(
        ((verifiedList || []).map((item: any) => ({
          ...item,
          created_at: item.verified_at,
        })) as AdminPredictionRecord[])
      );
    } catch (e: any) {
      setError(e.message || "Failed to load predictions from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPredictions();
    }
  }, [isLoggedIn, fetchPredictions]);

  // Login via Supabase Auth
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      setIsLoggedIn(true);
      setUsername(data.user?.email || "Admin");
      return true;
    } catch (e: any) {
      setError(e.message || "Invalid email or password.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout via Supabase Auth
  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUsername(null);
    setPredictions([]);
    setVerifiedPredictions([]);
  };

  // Submit active learning feedback / label correction
  const submitCorrection = async (recordId: string, actualDigit: number) => {
    try {
      const { error: updateError } = await supabase
        .from("predictions")
        .update({ actual_digit: actualDigit })
        .eq("id", recordId);

      if (updateError) throw updateError;

      // Optimistic UI Update
      setPredictions((prev) =>
        prev.map((p) => (String(p.id) === String(recordId) ? { ...p, actual_digit: actualDigit } : p))
      );

      // Refresh to fetch newly triggered verified row
      await fetchPredictions();
    } catch (e: any) {
      setError(e.message || "Failed to submit correction to Supabase.");
    }
  };

  return {
    isLoggedIn,
    username,
    predictions,
    verifiedPredictions,
    loading,
    error,
    login,
    logout,
    fetchPredictions,
    submitCorrection,
  };
}
