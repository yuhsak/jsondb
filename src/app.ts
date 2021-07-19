import { build } from './server'
import { SERVER_HOST, SERVER_PORT, TRUST_PROXY, MAX_PARAM_LENGTH, BODY_LIMIT, LOGGER } from './config'

build({ trustProxy: TRUST_PROXY, bodyLimit: BODY_LIMIT, maxParamLength: MAX_PARAM_LENGTH, logger: LOGGER }).listen({
  host: SERVER_HOST,
  port: SERVER_PORT,
})
