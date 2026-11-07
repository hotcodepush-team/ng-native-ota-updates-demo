import { DestroyRef, InjectionToken, Service, inject, signal } from '@angular/core';
import type {
  HotCodePush as HotCodePushApi,
  Release,
  SyncResult,
  UpdateRolledBackEvent,
} from '@hotcodepush/expo-ota-updates';

/**
 * The SDK, loaded when first injected. A static import would load react-native, which a test in
 * Node cannot parse, so a test provides a stand-in under this token.
 */
export const HOT_CODE_PUSH_API = new InjectionToken<HotCodePushApi>('app.hotCodePushApi', {
  factory: () => {
    const sdk = require('@hotcodepush/expo-ota-updates') as { HotCodePush: HotCodePushApi };
    return sdk.HotCodePush;
  },
});

@Service()
export class Updates {
  private readonly api = inject(HOT_CODE_PUSH_API);

  readonly currentRelease = signal<Release | null>(null);
  readonly deviceId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly isSyncing = signal(false);
  readonly lastRollback = signal<UpdateRolledBackEvent | null>(null);
  readonly lastSync = signal<SyncResult | null>(null);

  constructor() {
    void this.loadDevice();
    void this.loadState();
    this.listenForRollback();
  }

  async sync(): Promise<void> {
    this.isSyncing.set(true);
    try {
      this.lastSync.set(await this.api.sync());
      await this.loadState();
    } catch (error) {
      this.reportError(error);
    } finally {
      this.isSyncing.set(false);
    }
  }

  async showDebugScreen(): Promise<void> {
    try {
      await this.api.showDebugScreen();
    } catch (error) {
      this.reportError(error);
    }
  }

  private async loadDevice(): Promise<void> {
    try {
      this.deviceId.set((await this.api.getDevice()).id);
    } catch (error) {
      this.reportError(error);
    }
  }

  private async loadState(): Promise<void> {
    try {
      this.currentRelease.set((await this.api.getState()).currentRelease);
    } catch (error) {
      this.reportError(error);
    }
  }

  // The SDK fires this once, on the first start after a rollback.
  private listenForRollback(): void {
    const listening = this.api.addListener('updateRolledBack', (event) =>
      this.lastRollback.set(event),
    );
    inject(DestroyRef).onDestroy(() => void listening.then(({ remove }) => remove()));
  }

  private reportError(error: unknown): void {
    this.errorMessage.set(error instanceof Error ? error.message : String(error));
  }
}
