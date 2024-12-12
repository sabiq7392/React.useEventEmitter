import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Space, App } from "antd";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { IEvent } from "@/types/Session";
import { IValidationType } from "@/types/ValidationType";
import { EventTable } from "../_lego/atoms/EventTable";
import { useRouter } from "next/navigation";
import { BaseResponse, ServiceApi, ServiceApiResponse } from "@/services/ServiceApi";
import { IStatusPengajuan } from "@/types/StatusPengajuan";
import { useEventEmitter } from "@/utils/hooks/useEventEmitter";

export function AdmEventTable(): JSX.Element {
  const on = useEventEmitter((state) => state.on);
  const off = useEventEmitter((state) => state.off);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [validationTypes, setValidationTypes] = useState<IValidationType[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);


  const onFetchList = useCallback(async () => {
    setIsLoadingEvent(true);
    try {
      const response: ServiceApiResponse<
        BaseResponse<{ validation_types: IValidationType[]; events: IEvent[] }>
      > = await ServiceApi.GET({
        url: `${process.env.NEXT_PUBLIC_API_URL}/event/list`,
      });
      setEvents(response.data.data.events);
      setValidationTypes(response.data.data.validation_types);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoadingEvent(false);
    }
  }, []);

  useEffect(() => {
    onFetchList();
  }, [onFetchList]);

  useEffect(() => {
    on("refreshAdmEventTable", onFetchList);
    return () => {
      off("refreshAdmEventTable", onFetchList);
    };
  }, [off, on, onFetchList]);


  return (
    <Fragment>
      <EventTable 
        events={events}
        isLoadingEvent={isLoadingEvent} 
        validationTypes={validationTypes}
        action={({ event }) => (
          <Action 
            event={event}
            onRefresh={onFetchList}
          />
        )}       
      />
    </Fragment>
  );
}
