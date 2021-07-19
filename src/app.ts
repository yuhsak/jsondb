import { build } from './server'
import { SERVER_HOST, SERVER_PORT, ENABLE_CORS, TRUST_PROXY, MAX_PARAM_LENGTH, BODY_LIMIT, LOGGER } from './config'

build({ trustProxy: TRUST_PROXY, enableCors: ENABLE_CORS, bodyLimit: BODY_LIMIT, maxParamLength: MAX_PARAM_LENGTH, logger: LOGGER }).listen({
  host: SERVER_HOST,
  port: SERVER_PORT,
})
