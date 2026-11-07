import { Component, computed, inject } from '@angular/core';
import type { Release, SyncResult } from '@hotcodepush/expo-ota-updates';
import { Pressable, SafeAreaProvider, SafeAreaView, Text, View } from '@ng-native/components';
import { StatusBar } from '@ng-native/device';
import { Row } from './row.ts';
import { Updates } from './updates.ts';
import { VERSION } from './version.ts';

@Component({
  imports: [Pressable, Row, SafeAreaProvider, SafeAreaView, Text, View],
  selector: 'app-root',
  template: `
    <safe-area-provider>
      <safe-area-view class="screen">
        <view class="body">
          <text class="eyebrow">Bundle version</text>
          <text class="version">{{ version }}</text>
          <app-row label="Current release" [value]="currentReleaseText()" />
          <app-row label="Device id" [value]="deviceIdText()" />
          <app-row label="Last sync" [value]="lastSyncText()" />
          <app-row label="Last rollback" [value]="lastRollbackText()" />
          @if (updates.errorMessage(); as errorMessage) {
            <text class="error">{{ errorMessage }}</text>
          }

          <pressable
            accessibilityRole="button"
            class="button"
            [disabled]="updates.isSyncing()"
            (press)="updates.sync()"
          >
            <text class="button-label">Sync now</text>
          </pressable>
          <pressable
            accessibilityRole="button"
            class="secondary-button"
            (press)="updates.showDebugScreen()"
          >
            <text class="secondary-button-label">Debug screen</text>
          </pressable>
        </view>
      </safe-area-view>
    </safe-area-provider>
  `,
  styles: `
    :host {
      flex: 1;
    }
    .screen {
      flex: 1;
      background-color: #ffffff;
    }
    .body {
      flex: 1;
      padding: 48px 24px 24px;
    }
    .eyebrow {
      color: #6b6f76;
      font-size: 13px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .version {
      margin-bottom: 24px;
      color: #111318;
      font-size: 64px;
      font-weight: 700;
    }
    .error {
      margin-top: 14px;
      color: #b33a14;
      font-size: 15px;
    }
    .button {
      align-items: center;
      margin-top: 32px;
      padding: 16px;
      border-radius: 12px;
      background-color: #f2572b;
    }
    .button-label {
      color: #ffffff;
      font-size: 17px;
      font-weight: 600;
    }
    .secondary-button {
      align-items: center;
      padding: 16px;
    }
    .secondary-button-label {
      color: #b33a14;
      font-size: 15px;
    }
  `,
})
export class App {
  protected readonly updates = inject(Updates);
  protected readonly version = VERSION;

  protected readonly currentReleaseText = computed(() =>
    resolveReleaseText(this.updates.currentRelease()),
  );
  protected readonly deviceIdText = computed(() => this.updates.deviceId() ?? '…');
  protected readonly lastSyncText = computed(() => {
    if (this.updates.isSyncing()) {
      return 'syncing…';
    }
    const lastSync = this.updates.lastSync();
    return lastSync ? resolveSyncResultText(lastSync) : 'none yet';
  });
  protected readonly lastRollbackText = computed(() => {
    const lastRollback = this.updates.lastRollback();
    return lastRollback
      ? `from ${resolveReleaseText(lastRollback.fromRelease)} · ${lastRollback.reason}`
      : 'none';
  });

  constructor() {
    // The screen is always light, so the status bar icons are always dark.
    inject(StatusBar).set({ style: 'dark' });
  }
}

function resolveReleaseText(release: Release | null): string {
  return release ? `#${release.number} · ${release.bundleVersion}` : 'embedded';
}

function resolveSyncResultText(result: SyncResult): string {
  switch (result.status) {
    case 'up_to_date':
      return 'up_to_date';
    case 'available':
      return `available · ${resolveReleaseText(result.release)}`;
    case 'downloaded':
      return `downloaded · ${resolveReleaseText(result.release)}, applies ${result.applyStrategy}`;
    case 'applied':
      return `applied · ${resolveReleaseText(result.release)}`;
    case 'skipped':
      return `skipped · ${result.reason}`;
    case 'failed':
      return `failed · ${result.reason}: ${result.message}`;
  }
}
