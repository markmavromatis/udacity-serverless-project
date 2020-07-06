import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJGOw0ukO0EjXsMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1ldXVkNzUxdC51cy5hdXRoMC5jb20wHhcNMjAwNzAzMDE1NDQ2WhcN
MzQwMzEyMDE1NDQ2WjAkMSIwIAYDVQQDExlkZXYtZXV1ZDc1MXQudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2kmqbR1dB8H3/8uI
7m65HLY3O4gSkEvubHO8KH6ycv9CAFAJwY2lbtL5pOY6i/VAwjmYEe/Y6w6I2ch9
E4y4VUBGABNJPCSHWMoaS0frzxwTe7JptQRTPRHAOLfTeVqsUlp3Z1hGwE0wA6KN
rik5TnAwQEGfcSG6VrHCZomUJOYA8Cbt/sQ9YbAhYlRhDhKF/nboxWq/mu9kPlzo
Ly7ooW2dgdmpukyxDWLMziT7Q6USbNc/ZVrcFPgrInSjNZoStp/+UkYR2Ow0VUDb
cnpB9UataomU/ttuzJxNSHUruxnrMlZ/Z3zQwDzCjPZ53tsBugUdwEVgVUvebNYk
gbOQhQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQpIIy+m1Z6
+ndz9njphx4lUwiAyDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AJlXL0FWUpTr/wz0pgWtQnwO4W6hoFs0K6zPiPDDQJG0D2vj2h+GXwhLYdq+oU45
zdDYr1eY7Zac7g9GeBQ2bkcvAqBaFaTwX9J2OCDXFdIJ43xjxXsoWD1ekOtA1ZIn
eGY0EHi4QrcIWreBvv5lU71QCQb0o7o5mgn7lPCSJp503Bwcn0nDRwfghtpr7Hdz
k65x1AZ87v00aiqjx11+Wf1CIZ1RnnyRBqJvOYc7su7u3gVWc0jWQP72LoAGB1pj
13F1Gv5YC5k/8YGnDnFa5ICSS5xIJSUfGjbzABMUucBCtQmHTkqolka5r0Sy/1ny
T2EA7P5rgHhS7UGpwESmpAI=
-----END CERTIFICATE-----`

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

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

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  // console.log(jwt)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return token
}

function getToken(authHeader: string): JwtPayload {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token,           // Token from an HTTP header to validate
    cert,            // A certificate copied from Auth0 website
    { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
  ) as JwtPayload
  
}
