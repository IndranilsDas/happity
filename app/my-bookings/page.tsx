'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context"; // adjust to your path
import { db } from "../../lib/firebase"; // your initialized Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

interface BookingData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  babyAge?: string;
  activityId: string;
  activityTitle: string;
  bookingDate: string;
  participants: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    setLoading(true);
    setError(null);

    try {
      // build a simple query with no .orderBy()
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user!.uid)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BookingData, "id">),
      }));

      setBookings(data);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      let msg = err?.message || "Failed to load bookings. Please try again later.";
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        msg = "You don’t have permission to view these bookings.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div>Please log in to view your bookings.</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <div className="error-message bg-red-50 border border-red-200 p-4 rounded-lg flex items-start space-x-3">
          <span className="error-icon text-red-600 font-bold">!</span>
          <div>
            <h2 className="error-title text-xl font-semibold text-red-700">Error</h2>
            <p className="error-description text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{b.activityTitle}</h2>
            <p>Date: {b.bookingDate}</p>
            <p>Participants: {b.participants}</p>
            <p>Status: {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
