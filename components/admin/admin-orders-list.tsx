"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Search } from "lucide-react";
import { listAdminOrdersAction } from "@/app/_actions/admin-order-actions";
import { AdminOrderMobileCard } from "@/components/admin/admin-order-card";
import {
  AdminDesktopTable,
  AdminMobileCards,
} from "@/components/admin/admin-responsive-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatToman } from "@/lib/format";
import {
  formatOrderDate,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import { notifyError } from "@/lib/notify-action";
import { formatCount } from "@/lib/normalize-reports";
import type { OrderRead } from "@/types/order.api";
import { cn } from "@/lib/utils";

type QuickFilter = {
  id: string;
  label: string;
  status: string;
  payment: string;
};

const QUICK_FILTERS: QuickFilter[] = [
  { id: "all", label: "همه", status: "", payment: "" },
  { id: "action", label: "نیاز به اقدام", status: "", payment: "pending_review" },
  { id: "preparing", label: "آماده‌سازی", status: "preparing", payment: "" },
  { id: "shipped", label: "ارسال شده", status: "shipped", payment: "" },
  { id: "awaiting", label: "در انتظار رسید", status: "", payment: "awaiting_receipt" },
];

type AdminOrdersListProps = {
  defaultPaymentStatus?: string;
  defaultStatus?: string;
  title?: string;
};

function orderItemCount(order: OrderRead): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function matchesOrderQuery(order: OrderRead, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    order.id.toLowerCase().includes(q) ||
    order.shippingFullName.toLowerCase().includes(q) ||
    order.shippingPhone.includes(q)
  );
}

export function AdminOrdersList({
  defaultPaymentStatus,
  defaultStatus,
  title = "سفارشات",
}: AdminOrdersListProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(defaultStatus ?? "");
  const [paymentFilter, setPaymentFilter] = useState(
    defaultPaymentStatus ?? ""
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const activeQuickFilter =
    QUICK_FILTERS.find(
      (filter) =>
        filter.status === statusFilter && filter.payment === paymentFilter
    )?.id ?? "custom";

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listAdminOrdersAction({
      page,
      pageSize: 20,
      status: statusFilter || undefined,
      paymentStatus: paymentFilter || undefined,
    });
    setLoading(false);
    if (result.success) {
      setOrders(result.data.orders);
      setTotal(result.data.total);
      return;
    }
    notifyError(result.error);
  }, [page, paymentFilter, statusFilter]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesOrderQuery(order, query)),
    [orders, query]
  );

  const applyQuickFilter = (filter: QuickFilter) => {
    setPage(1);
    setStatusFilter(filter.status);
    setPaymentFilter(filter.payment);
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          فیلتر سریع، جستجو و مدیریت وضعیت سفارش‌ها
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <Button
            key={filter.id}
            type="button"
            size="sm"
            variant={activeQuickFilter === filter.id ? "default" : "outline"}
            onClick={() => applyQuickFilter(filter)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 rounded-xl border border-input bg-background px-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار پرداخت</option>
            <option value="confirmed">تأیید شده</option>
            <option value="preparing">در حال آماده‌سازی</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
          {!defaultPaymentStatus && (
            <select
              className="h-9 rounded-xl border border-input bg-background px-2 text-sm"
              value={paymentFilter}
              onChange={(e) => {
                setPage(1);
                setPaymentFilter(e.target.value);
              }}
            >
              <option value="">همه پرداخت‌ها</option>
              <option value="awaiting_receipt">در انتظار رسید</option>
              <option value="pending_review">در انتظار تأیید</option>
              <option value="verified">تأیید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          )}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی شناسه، نام یا تلفن..."
            className="ps-9"
          />
        </div>
      </div>

      {query.trim() && (
        <p className="text-xs text-muted-foreground">
          جستجو در {formatCount(filteredOrders.length)} نتیجه از صفحه فعلی
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          سفارشی یافت نشد.
        </div>
      ) : (
        <>
          <AdminMobileCards>
            {filteredOrders.map((order) => (
              <AdminOrderMobileCard key={order.id} order={order} />
            ))}
          </AdminMobileCards>

          <AdminDesktopTable>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-start">
                  <th className="px-4 py-3 font-medium">شناسه</th>
                  <th className="px-4 py-3 font-medium">تاریخ</th>
                  <th className="px-4 py-3 font-medium">مشتری</th>
                  <th className="px-4 py-3 font-medium">اقلام</th>
                  <th className="px-4 py-3 font-medium">مبلغ</th>
                  <th className="px-4 py-3 font-medium">وضعیت</th>
                  <th className="px-4 py-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b border-border transition last:border-0 hover:bg-muted/40"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs" dir="ltr">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatOrderDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p>{order.shippingFullName}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {order.shippingPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {orderItemCount(order)} عدد
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatToman(order.total)}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          جزئیات
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminDesktopTable>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {page} از {totalPages} ({formatCount(total)} سفارش)
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}
