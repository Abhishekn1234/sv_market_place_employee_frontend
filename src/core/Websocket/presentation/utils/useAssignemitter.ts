import { initializeSocket } from "../components/socket";

const socket = initializeSocket("/workers/assigned-updates");

export function useAssignedEmitter() {
  const emitStart = (payload: any) => {
    socket.emit("booking.work.started", payload);
  };

  const emitComplete = (payload: any) => {
    socket.emit("booking.work.completed-by-worker", payload);
  };

  const emitVerify = (payload: any) => {
    socket.emit("booking.completion.confirmed", payload);
  };

  const emitCancel = (payload: any) => {
    socket.emit("booking.worker.rejected", payload);
  };

  const emitDispute = (payload: any) => {
    socket.emit("booking.dispute.created", payload);
  };

  return {
    emitStart,
    emitComplete,
    emitVerify,
    emitCancel,
    emitDispute,
  };
}