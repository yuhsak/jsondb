import Cron from 'node-cron'
import { build } from './server'
import { clean } from './clean'
import { SERVER_HOST, SERVER_PORT, ENABLE_CORS, TRUST_PROXY, MAX_PARAM_LENGTH, BODY_LIMIT, LOGGER, ENABLE_CLEANER } from './config'

build({ trustProxy: TRUST_PROXY, enableCors: ENABLE_CORS, bodyLimit: BODY_LIMIT, maxParamLength: MAX_PARAM_LENGTH, logger: LOGGER }).listen({
  host: SERVER_HOST,
  port: SERVER_PORT,
})

if (ENABLE_CLEANER) {
  Cron.schedule('0 0 0 * * *', clean)
}
