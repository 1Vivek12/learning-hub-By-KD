import { prisma } from '@/lib/db/prisma';

const DEFAULT_SETTINGS: Record<string, unknown> = {
  siteName: 'Learning Hub',
  logo: '/logo.svg',
  supportEmail: 'support@learninghub.dev',
  supportPhone: '+91 000 000 0000',
  currency: 'INR',
  defaultLanguage: 'en',
  maintenanceMode: false,
};

export class SettingsService {
  static async getSetting(key: string): Promise<unknown> {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    if (setting) return setting.value;
    return DEFAULT_SETTINGS[key] ?? null;
  }

  static async getAllSettings(): Promise<Record<string, unknown>> {
    const dbSettings = await prisma.siteSetting.findMany();
    const merged: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    for (const s of dbSettings) {
      merged[s.key] = s.value;
    }
    return merged;
  }

  static async upsertSetting(key: string, value: unknown) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as any },
      create: { key, value: value as any },
    });
  }

  static async deleteSetting(key: string) {
    return prisma.siteSetting.delete({ where: { key } });
  }
}
