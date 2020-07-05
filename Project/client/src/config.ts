// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '594625448788'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-euud751t.us.auth0.com',            // Auth0 domain
  clientId: 'mrTftgFUUIuzRZcSG3i8KK51C5Ley2gY',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
