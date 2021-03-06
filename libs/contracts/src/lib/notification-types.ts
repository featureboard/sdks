// NOTE all notifications should coerce the value into the expected type

export interface AudienceExceptionValue {
    audienceKey: string
    value: string | boolean | number
}

export interface FeatureConfiguration {
    featureKey: string
    defaultValue: string | boolean | number
    audienceExceptions: AudienceExceptionValue[]
}

export interface StateOfTheWorldNotification {
    kind: 'state-of-the-world'

    features: FeatureConfiguration[]
}

export interface EffectiveFeatureValue {
    featureKey: string
    value: string | boolean | number
}

export interface StateOfTheWorldEffectiveValuesNotification {
    kind: 'state-of-the-world-effective-values'

    features: EffectiveFeatureValue[]
}

export interface SubscriptionErrorNotification {
    kind: 'subscription-error'
    error: string
}
export interface FeatureValueUpdatedNotification {
    kind: 'feature-value-updated'
    featureKey: string
    value: string | boolean | number
}

export interface FeatureValueAvailableNotification {
    kind: 'feature-value-available'
    featureKey: string
    value: string | boolean | number
}

/** Sent for all-values subscription when feature updated */
export interface FeatureValueNotification extends FeatureConfiguration {
    kind: 'feature-updated'
}

export interface FeatureAvailable extends FeatureConfiguration {
    kind: 'feature-available'
}

export interface FeatureUnavailable {
    kind: 'feature-unavailable'
    featureKey: string
}

export type NotificationType =
    | SubscriptionErrorNotification
    | FeatureUnavailable
    // all-values subscription
    | StateOfTheWorldNotification
    | FeatureValueNotification
    | FeatureAvailable
    // effective values subscription
    | StateOfTheWorldEffectiveValuesNotification
    | FeatureValueUpdatedNotification
    | FeatureValueAvailableNotification
