import { createEnsureSingle, FetchSignature } from '@featureboard/js-sdk'
import { fetchFeaturesConfigurationViaHttp } from '../utils/fetchFeaturesConfiguration'
import { getAllEndpoint } from './getAllEndpoint'
import { AllConfigUpdateStrategy } from './update-strategies'

export function createManualUpdateStrategy(
    environmentApiKey: string,
    httpEndpoint: string,
    fetchInstance: FetchSignature,
): AllConfigUpdateStrategy {
    let lastModified: undefined | string
    let fetchUpdatesSingle: undefined | (() => Promise<void>)

    return {
        async connect(state) {
            // Ensure that we don't trigger another request while one is in flight
            fetchUpdatesSingle = createEnsureSingle(async () => {
                const allEndpoint = getAllEndpoint(httpEndpoint)
                lastModified = await fetchFeaturesConfigurationViaHttp(
                    fetchInstance,
                    allEndpoint,
                    environmentApiKey,
                    state,
                    lastModified,
                )
            })

            return fetchUpdatesSingle()
        },
        close() {
            return Promise.resolve()
        },
        get state() {
            return 'connected' as const
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
