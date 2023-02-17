import PubNub from 'pubnub';
import { PUBNUB_KEYS } from './config.js';

const CHANNELS: { [CHANNEL: string]: string } = {
  TEST: 'TEST',
};

export default class PubSub {
  pubnub: PubNub;

  constructor() {
    this.pubnub = new PubNub(PUBNUB_KEYS);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: (messageObject: { channel: string; message: string }): void => {
        const { channel, message } = messageObject;
        console.log(`CHANNEL: ${channel}, MESSAGE: ${message}`);
      },
    };
  }

  publish({ channel, message }: { channel: string; message: JSON | string }) {
    this.pubnub.publish({ channel, message });
  }
}
