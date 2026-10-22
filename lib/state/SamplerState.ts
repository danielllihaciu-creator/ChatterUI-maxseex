import { getDocumentAsync } from 'expo-document-picker'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import {
    defaultSamplerConfig,
    SamplerConfigData,
    SamplerID,
    Samplers,
} from '@lib/constants/SamplerData'
import { Storage } from '@lib/enums/Storage'
import { Logger } from '@lib/state/Logger'
import { createMMKVStorage } from '@lib/storage/MMKV'
import { readStringAsync } from '@lib/utils/File'

export type SamplerConfig = {
    name: string
    data: SamplerConfigData
}

export type SamplerStateProps = {
    currentConfigIndex: number
    configList: SamplerConfig[]
    updateCurrentConfig: (preset: SamplerConfig) => void
    addSamplerConfig: (preset: SamplerConfig) => void
    deleteSamplerConfig: (index: number) => void
    setConfig: (index: number) => void
    fixConfigs: () => void
}

export namespace SamplersManager {
    export const useSamplerStore = create<SamplerStateProps>()(
        persist(
            (set, get) => ({
                currentConfigIndex: 0,
                configList: [{ name: 'Default', data: defaultSamplerConfig }],
                addSamplerConfig: (config) => {
                    const configs = get().configList
                    if (configs.some((item) => item.name === config.name)) {
                        Logger.errorToast(`Sampler Config "${config.name}" already exists!`)
                        return
                    }
                    config.data = fixSamplerConfig(config.data)
                    set((state) => ({
                        configList: [...state.configList, config],
                        currentConfigIndex: state.configList.length,
                    }))
                },
                deleteSamplerConfig: (index) => {
                    set((state) => ({
                        configList: state.configList.filter((item, i) => i !== index),
                        currentConfigIndex:
                            index === state.currentConfigIndex ? 0 : state.currentConfigIndex,
                    }))
                },
                setConfig: (index) => {
                    const maxLength = get().configList.length
                    if (index >= maxLength || index < 0) {
                        return
                    }
                    set({ currentConfigIndex: index })
                },
                updateCurrentConfig: (config) => {
                    const configs = get().configList
                    const index = get().currentConfigIndex
                    // Ensure we fix the config before saving to state!
                    config.data = fixSamplerConfig(config.data)
                    configs[index] = config
                    set({ configList: [...configs] })
                },
                fixConfigs: () => {
                    set((state) => ({
                        configList: state.configList.map((item) => ({
                            name: item.name,
                            data: fixSamplerConfig(item.data),
                        })),
                    }))
                },
            }),
            {
                name: Storage.Samplers,
                storage: createMMKVStorage(),
                version: 1,
                partialize: (state) => ({
                    configList: state.configList,
                    currentConfigIndex: state.currentConfigIndex,
                }),
                migrate: async (persistedState: any, version) => {
                    //no migrations yet
                },
            }
        )
    )

    export const useSamplers = () => {
        const {
            currentPresetIndex: currentConfigIndex,
            samplerConfigs,
            addSamplerConfig,
            deleteSamplerConfig,
            changeConfig,
            updateCurrentConfig,
            configList,
        } = useSamplerStore(
            useShallow((state) => ({
                currentPresetIndex: state.currentConfigIndex,
                samplerConfigs: state.configList,
                addSamplerConfig: state.addSamplerConfig,
                deleteSamplerConfig: state.deleteSamplerConfig,
                changeConfig: state.setConfig,
                updateCurrentConfig: state.updateCurrentConfig,
                configList: state.configList,
            }))
        )

        const currentConfig = samplerConfigs[currentConfigIndex]

        return {
            currentConfigIndex,
            addSamplerConfig,
            deleteSamplerConfig,
            changeConfig,
            updateCurrentConfig,
            currentConfig,
            configList,
        }
    }

    export function getCurrentSampler() {
        return useSamplerStore.getState().configList[useSamplerStore.getState().currentConfigIndex]
            .data
    }

    export function useCurrentSampler(): SamplerConfig | undefined {
        const { currentConfigIndex, configList } = useSamplers()
        return configList?.[currentConfigIndex]
    }

    export async function importConfigFile(): Promise<SamplerConfig | undefined> {
        try {
            const result = await getDocumentAsync({ type: ['application/*'] })
            if (
                result.canceled ||
                (!result.assets[0].name.endsWith('json') &&
                    !result.assets[0].name.endsWith('settings'))
            ) {
                Logger.errorToast(`Invalid File Type!`)
                return
            }
            const {
                assets: [asset],
            } = result
            const name = asset.name.replace(`.json`, '').replace('.settings', '').replace(' ', '_')
            const data = await readStringAsync(asset.uri)

            return { data: JSON.parse(data), name: name }
        } catch (e) {
            Logger.errorToast(`Failed to import: ${e}`)
        }
    }
}

// Helper function to safely convert any value (string or number) to a valid decimal number
function sanitizeDecimal(value: any, defaultValue: number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
}

export function fixSamplerConfig(config: SamplerConfigData) {
    const existingKeys = Object.keys(config)
    const defaultKeys = Object.values(SamplerID) as SamplerID[]
    let samekeys = true

    // List of all Sampler IDs that REQUIRE a decimal (float) value
    const decimalKeys = [
        SamplerID.TEMPERATURE,
        SamplerID.TOP_P,
        SamplerID.MIN_P,
        SamplerID.TYPICAL_P,
        SamplerID.REPETITION_PENALTY,
        SamplerID.PRESENCE_PENALTY,
        SamplerID.FREQUENCY_PENALTY,
        // Add any other decimal settings you have here
    ];

    defaultKeys.map((key) => {
        // 1. Handle SEED (Integer)
        if (key === SamplerID.SEED) {
            const parsed = parseInt(String(config[key]), 10);
            config[key] = isNaN(parsed) ? (Samplers[key].values.default as number) : parsed;
        }
        // 2. Handle DECIMALS (Temperature, Top P, etc.)
        else if (decimalKeys.includes(key)) {
            const defaultVal = (Samplers[key].values.default as number) ?? 0;
            // Force convert strings like "0.7" to 0.7
            config[key] = sanitizeDecimal(config[key], defaultVal);
        }

        // 3. Check for missing keys
        if (existingKeys.includes(key)) return;
        
        const data = Samplers[key].values.default
        //@ts-expect-error needs more coercion, but probably fine
        config[key] = data
        samekeys = false
        Logger.debug(`Sampler Config was missing field: ${key}`)
    })
    
    if (!samekeys) Logger.warn(`Sampler Config had missing fields and was fixed!`)
    return config
}
