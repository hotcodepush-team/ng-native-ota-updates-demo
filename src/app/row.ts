import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

@Component({
  imports: [Text, View],
  selector: 'app-row',
  template: `
    <view class="row">
      <text class="label">{{ label() }}</text>
      <text class="value">{{ value() }}</text>
    </view>
  `,
  styles: `
    .row {
      padding: 14px 0;
      border-bottom-width: 1px;
      border-bottom-color: #e6e7ea;
    }
    .label {
      color: #6b6f76;
      font-size: 13px;
    }
    .value {
      margin-top: 4px;
      color: #111318;
      font-size: 17px;
    }
  `,
})
export class Row {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
