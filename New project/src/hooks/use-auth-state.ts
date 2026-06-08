"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

import { firebaseConfigReady, getFirebaseAuth } from "@/lib/firebase";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(firebaseConfigReady);

  useEffect(() => {
    if (!firebaseConfigReady) {
      setIsAuthLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });
  }, []);

  return { user, isAuthLoading };
}
