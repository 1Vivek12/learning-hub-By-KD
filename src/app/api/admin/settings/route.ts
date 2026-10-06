import { NextResponse } from "next/server";
import { SettingsService } from "@/lib/services/settingsService";
import { AuditService } from "@/lib/services/auditService";
import { getApiAdmin } from "@/lib/auth/utils";

export async function GET() {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const settings = await SettingsService.getAllSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { session, errorResponse } = await getApiAdmin();
    if (errorResponse) return errorResponse;
    const body = await request.json();
    
    const allowedKeys = [
      'siteName', 'logoUrl', 'supportEmail', 'supportPhone',
      'currency', 'defaultLanguage', 'maintenanceMode',
      'announcementBarEnabled', 'announcementText',
      'videoProvider', 'paymentProvider', 'liveClassProvider'
    ];
    
    const results: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedKeys.includes(key)) {
        const setting = await SettingsService.upsertSetting(key, value);
        results[key] = setting.value;
      }
    }
    
    await AuditService.log({
      actor: session!.user?.email ?? undefined,
      action: 'SETTINGS_UPDATED',
      resource: 'SiteSetting',
      details: { keys: Object.keys(body) },
    });
    
    return NextResponse.json(results);
  } catch (error: any) {
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
