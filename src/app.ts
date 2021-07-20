import Cron from 'node-cron'
import { build } from './server'
import { clean } from './clean'
import {
  SERVER_HOST,
  SERVER_PORT,
  TRUST_PROXY,
  MAX_PARAM_LENGTH,
  MAX_BODY_SIZE_KB,
  ENABLE_CORS,
  CORS_ORIGIN,
  ENABLE_LOGGER,
  LOGGER_LEVEL,
  LOGGER_PRETTY_PRINT,
  ENABLE_CLEANUP,
} from './config'

build({
  trustProxy: TRUST_PROXY,
  bodyLimit: MAX_BODY_SIZE_KB * 1000,
  maxParamLength: MAX_PARAM_LENGTH,
  enableCors: ENABLE_CORS,
  corsOrigin: CORS_ORIGIN,
  enableLogger: ENABLE_LOGGER,
  loggerLevel: LOGGER_LEVEL,
  loggerPrettyPrint: LOGGER_PRETTY_PRINT,
}).listen({
  host: SERVER_HOST,
  port: SERVER_PORT,
})

if (ENABLE_CLEANUP) {
  Cron.schedule('0 0 * * * *', clean)
}
