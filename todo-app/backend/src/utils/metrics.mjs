import {
  CloudWatchClient,
  PutMetricDataCommand
} from '@aws-sdk/client-cloudwatch'

const cloudwatchClient = new CloudWatchClient()

export async function sendLatencyMetric(
  namespace,
  serviceName,
  totalTimeInMillis
) {
  const input = {
    MetricData: [
      {
        MetricName: 'Latency',
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds',
        Value: totalTimeInMillis
      }
    ],
    Namespace: namespace
  }
  const command = new PutMetricDataCommand(input)
  await cloudwatchClient.send(command)
}

export function timeInMillis() {
    return new Date().getTime()
  }