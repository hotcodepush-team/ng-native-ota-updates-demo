import type { HotCodePush } from '@hotcodepush/expo-ota-updates';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';
import { HOT_CODE_PUSH_API } from './updates.ts';

type Result<Method extends keyof HotCodePush> = Awaited<ReturnType<HotCodePush[Method]>>;

const fakeApi: Partial<HotCodePush> = {
  addListener: async () => ({ remove: async () => undefined }),
  getDevice: async () => ({ id: 'device-1' }) as Result<'getDevice'>,
  getState: async () => ({ currentRelease: null }) as Result<'getState'>,
  sync: async () => ({ release: null, status: 'up_to_date' }),
};

test('shows the device and the result of a sync', async () => {
  await render(App, { providers: [{ provide: HOT_CODE_PUSH_API, useValue: fakeApi }] });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Sync now' }));

  expect(screen.getByText('device-1')).toBeTruthy();
  expect(screen.getByText('up_to_date')).toBeTruthy();
});
