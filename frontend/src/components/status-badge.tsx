import { Badge } from "@/components/ui/badge";

export type NoticeStatus = "APPROVED" | "DECLINED" | "PENDING";

const map: Record<NoticeStatus, string> = {
  APPROVED: "border-transparent bg-success/12 text-success",
  DECLINED: "border-transparent bg-destructive/12 text-destructive",
  PENDING: "border-transparent bg-warning/15 text-warning",
};

export function StatusBadge({ status }: { status: NoticeStatus }) {
  return (
    <Badge variant="outline" className={`font-semibold tracking-wide ${map[status]}`}>
      {status}
    </Badge>
  );
}
