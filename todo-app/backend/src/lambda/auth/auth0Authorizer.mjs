import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const logger = createLogger('auth')

const ssmClient = new SSMClient()
const ssmXRayClient = AWSXRay.captureAWSv3Client(ssmClient)

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  const kid = jwt.header.kid
  let certificate = ''
  const keys = await getJwks()
  for (const keySet of keys) {
    if (kid == keySet.kid) {
      const certString = keySet.x5c[0]
      certificate = `-----BEGIN CERTIFICATE-----\n${certString
        .match(/.{1,64}/g)
        .join('\n')}\n-----END CERTIFICATE-----`
      break
    }
  }
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

async function getJwks() {
  const response = await ssmXRayClient.send(
    new GetParameterCommand({
      Name: process.env.AUTH0_URL_SSM_PATH
    })
  )
  const auth0Url = response.Parameter.Value.trim()
  const jwksUrlResponse = await Axios.get(`${auth0Url}/.well-known/jwks.json`)
  return jwksUrlResponse.data.keys
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
