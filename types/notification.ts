/**
 * Shapes for the notification bell in the admin navbar.
 *
 * Derived from what `Notification.tsx` already renders — the union below is
 * exactly the set of kinds it has styling for, so adding a kind here without
 * adding a row to its TYPE_CONFIG will not compile, which is the point.
 */

export type NotificationType =
  | "system"
  | "order"
  | "message"
  | "payment"
  | "payout"
  | "product_approval"
  | "merchant_kyc"
  | "support"
  | "review"
  | "cashback"
  | "affiliate"
  | "wishlist_price_drop"
  | "promotional";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  /** The line under the title. */
  body: string;
  isRead: boolean;
  /** ISO 8601, rendered as "8 minutes ago". */
  createdAt: string;
  /** Where clicking the row goes, when it goes anywhere. */
  actionUrl?: string;
}
