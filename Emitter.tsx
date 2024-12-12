import { useEventEmitter } from "@/utils/hooks/useEventEmitter";


export function Emitter(): JSX.Element {
  const emit = useEventEmitter((state) => state.emit);

  return (
    <Button
      icon={<IoMdRefresh />}
      onClick={() => emit("refreshAdmEventTable")}
    />
  )
}
