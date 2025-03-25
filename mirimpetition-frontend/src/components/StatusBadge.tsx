
import { cn } from "@/lib/utils";

export type StatusType = "pending" | "progress" | "answered" | "rejected" | "expired";

interface StatusBadgeProps {
  status: StatusType;
  count?: number;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "심사 중",
    colorClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  progress: {
    label: "진행 중",
    colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  answered: {
    label: "답변 완료",
    colorClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  rejected: {
    label: "반려됨",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  expired: {
    label: "기한 만료",
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

export function StatusBadge({ status, count, className }: StatusBadgeProps) {
  const { label, colorClass } = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      colorClass,
      className
    )}>
      {label}
      {count !== undefined && (
        <span className="ml-1.5 bg-white/30 dark:bg-black/30 px-1.5 py-0.5 rounded-full text-[0.625rem]">
          {count}
        </span>
      )}
    </span>
  );
}
