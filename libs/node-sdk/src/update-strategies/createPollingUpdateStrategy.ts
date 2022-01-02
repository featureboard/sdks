import { createEnsureSingle } from '@featureboard/js-sdk'
import nodeFetch from 'node-fetch'
import {
    fetchFeaturesConfigurationViaHttp,
    FetchSignature,
} from '../utils/fetchFeaturesConfiguration'
import { pollingUpdates } from '../utils/pollingUpdates'
import { AllConfigUpdateStrategy } from './update-strategies'

export function createPollingUpdateStrategy(
    environmentApiKey: string,
    httpEndpoint: string,
    intervalMs: number,
    fetch: FetchSignature | undefined,
): AllConfigUpdateStrategy {
    let stopPolling: undefined | (() => void)
    let lastModified: undefined | string
    let fetchUpdatesSingle: undefined | (() => Promise<void>)

    return {
        async connect(state) {
            // Ensure that we don't trigger another request while one is in flight
            fetchUpdatesSingle = createEnsureSingle(async () => {
                lastModified = await fetchFeaturesConfigurationViaHttp(
                    fetch || (nodeFetch as any),
                    httpEndpoint,
                    environmentApiKey,
                    state,
                    lastModified,
                )
            })

            if (stopPolling) {
                stopPolling()
            }
            stopPolling = pollingUpdates(() => {
                if (fetchUpdatesSingle) {
                    fetchUpdatesSingle()
                }
            }, intervalMs)

            return fetchUpdatesSingle()
        },
        async close() {
            if (stopPolling) {
                stopPolling()
            }
        },
        get state() {
            if (stopPolling) {
                return 'connected'
            }
            return 'disconnected'
        },
        async updateFeatures() {
            if (fetchUpdatesSingle) {
                await fetchUpdatesSingle()
            }
        },
        onRequest() {
            return undefined
        },
    }
}