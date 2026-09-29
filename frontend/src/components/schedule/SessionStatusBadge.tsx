import { SessionStatus } from "@/types/session";

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

const statusConfig: Record<
  SessionStatus,
  {
    label: string;
    className: string;
  }
> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-600",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-violet-50 text-violet-600",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600",
  },
  no_show: {
    label: "No Show",
    className: "bg-amber-50 text-amber-600",
  },
};

export default function SessionStatusBadge({
  status,
}: SessionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}