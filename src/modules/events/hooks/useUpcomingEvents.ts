// modules/events/hooks/useEvents.ts

import {
  useEffect,
  useState,
} from "react";

import {
  useAuthStore,
} from "@/store/authStore";

import {
  getEvents,
} from "../service/event.services";

import {
  EventItem,
} from "../types/event.types";
import { useChurchStore } from "@/store/churchStore";

export default function useEvents() {
  const [
    events,
    setEvents,
  ] = useState<EventItem[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  // Pull-to-refresh state is separate from `loading` on purpose:
  // `loading` swaps the whole screen for a spinner, which would
  // tear down the very list being pulled.
  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const user =
    useAuthStore(
      state => state.user
    );

  const tenantId =
      useChurchStore(
        state => state.tenantId
      );

  // const tenantId = "c6eea581-ba26-4917-bff2-24e37a66a768"

  useEffect(() => {
    console.log("LOAD EVENTS FIRED");
    loadEvents();
  }, [tenantId]);

  

  const loadEvents =
    async () => {
      
      try {
        if (!tenantId) {
          return;
        }

        setLoading(true);

        const response =
          await getEvents(
            tenantId
          );

        console.log(
          "EVENTS RESPONSE:",
          response
        );

        setEvents(
          response?.object ??
            []
        );
      } catch (
        error
      ) {
        console.log(
          "EVENTS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadEvents();
  }, [tenantId]);

  const onRefresh =
    async () => {
      if (!tenantId) {
        return;
      }

      setRefreshing(true);

      try {
        const response =
          await getEvents(
            tenantId
          );

        setEvents(
          response?.object ??
            []
        );
      } catch (error) {
        console.log(
          "EVENTS REFRESH ERROR:",
          error
        );
      } finally {
        setRefreshing(false);
      }
    };

  return {
    events,
    loading,
    refreshing,
    onRefresh,
    reloadEvents:
      loadEvents,
  };
}