export interface DexOSApp {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  redirect_url: string;
  access_status: boolean;
  access_restore_date: string | null;
  internal_type: "external" | "terminal" | "archive" | "settings";
  display_order: number;
  created_at: string;
}
