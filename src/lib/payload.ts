import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

// Payload yerel API istemcisi (HTTP değil, doğrudan veritabanı erişimi — hızlı).
export const getPayloadClient = async () => getPayload({ config })
