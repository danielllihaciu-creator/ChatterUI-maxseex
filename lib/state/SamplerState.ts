limport { getDocumentAsync } from 'expo-document-picker'
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

    defaultKeys.forEach((key) => {
        // 1. If it's missing, add the default
        if (!existingKeys.includes(key)) {
            //@ts-expect-error needs more coercion
            config[key] = Samplers[key].values.default
            samekeys = false
            Logger.debug(`Sampler Config was missing field: ${key}`)
            return
        }

        // 2. Check what TYPE the default value is. That tells us what the API expects.
        const defaultValue = Samplers[key].values.default
        
        if (typeof defaultValue === 'number') {
            // If the default is an integer (no decimal point), force integer
            if (Number.isInteger(defaultValue)) {
                const parsed = parseInt(String(config[key]), 10)
                //@ts-expect-error needs more coercion
                config[key] = isNaN(parsed) ? defaultValue : parsed
            } 
            // If the default is a decimal (like 0.7), force float
            else {
                const parsed = parseFloat(String(config[key]))
                //@ts-expect-error needs more coercion
                config[key] = isNaN(parsed) ? defaultValue : parsed
            }
        }
        // 3. If the default is a boolean, force boolean
        else if (typeof defaultValue === 'boolean') {
            if (typeof config[key] === 'string') {
                //@ts-expect-error needs more coercion
                config[key] = (config[key] as string).toLowerCase() === 'true'
            }
        }
        // 4. Strings stay strings
        else if (typeof defaultValue === 'string') {
            //@ts-expect-error needs more coercion
            config[key] = String(config[key])
        }
    })

    if (!samekeys) Logger.warn(`Sampler Config had missing fields and was fixed!`)
    return config
}
