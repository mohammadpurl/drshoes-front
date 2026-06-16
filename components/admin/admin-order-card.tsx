"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import {
  AdminCardRow,
  AdminMobileCard,
} from "@/components/admin/admin-responsive-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/format";
import {
  formatOrderDate,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import type { OrderRead } from "@/types/order.api";
import { cn } from "@/lib/utils";

function orderItemCount(order: OrderRead): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

type AdminOrderMobileCardProps = {
  order: OrderRead;
  actionLabel?: string;
};

export function AdminOrderMobileCard({
  order,
  actionLabel = "جزئیات",
}: AdminOrderMobileCardProps) {
  const router = useRouter();

  return (
    <AdminMobileCard onClick={() => router.push(`/admin/orders/${order.id}`)}>
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant="outline"
          className={cn(
            orderDisplayStatusClass(order),
            order.paymentStatus === "pending_review" &&
              "ring-1 ring-amber-400/50"
          )}
        >
          {orderDisplayStatusLabel(order)}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground" dir="ltr">
          #{order.id.slice(0, 8)}
        </span>
      </div>

      <div className="mt-3 space-y-0">
        <AdminCardRow label="مشتری">
          <div>
            <p className="font-medium">{order.shippingFullName}</p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {order.shippingPhone}
            </p>
          </div>
        </AdminCardRow>
        <AdminCardRow label="تاریخ">
          <span className="text-xs text-muted-foreground">
            {formatOrderDate(order.createdAt)}
          </span>
        </AdminCardRow>
        <AdminCardRow label="اقلام">
          <span>{orderItemCount(order)} عدد</span>
        </AdminCardRow>
        <AdminCardRow label="مبلغ">
          <span className="font-semibold text-primary">
            {formatToman(order.total)}
          </span>
        </AdminCardRow>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/admin/orders/${order.id}`}>
            <Eye className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      </div>
    </AdminMobileCard>
  );
}
