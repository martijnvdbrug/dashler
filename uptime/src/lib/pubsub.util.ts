import {PubSub} from '@google-cloud/pubsub';

export class PubsubUtil {

  static async publish(topicName: string, payload: any): Promise<void> {
    const pubsub = new PubSub();
    const attributes = {
      createdAt: new Date().toISOString()
    };
    await pubsub.topic(topicName).publish(Buffer.from(JSON.stringify(payload)), attributes);
  }

  static async subscribe(topicName: string, subscriptionName: string, messageHandler: (...args: any[]) => void, errorHandler: (...args: any[]) => void) {
    const options = {
      flowControl: {
        maxBytes: 10000,
        maxMessages: 10
      }
    };
    const pubsub = new PubSub();
    const subscription = pubsub.topic(topicName).subscription(subscriptionName, options);
    await subscription.get({autoCreate: true});
    subscription.on(`message`, messageHandler);
    subscription.on(`error`, errorHandler);
  }

}
