export enum SamplerID {
    TEMPERATURE = 'temp',
    MIN_P = 'min_p',
    TOP_K = 'top_k',
    TOP_A = 'top_a',
    TOP_P = 'top_p',
    SINGLE_LINE = 'single_line',
    SEED = 'seed',
    TAIL_FREE_SAMPLING = 'tfs',
    EPSILON_CUTOFF = 'epsilon_cutoff',
    ETA_CUTOFF = 'eta_cutoff',
    TYPICAL = 'typical',
    REPETITION_PENALTY = 'rep_pen',
    REPETITION_PENALTY_RANGE = 'rep_pen_range',
    REPETITION_PENALTY_SLOPE = 'rep_pen_slope',
    NO_REPEAT_NGRAM_SIZE = 'no_repeat_ngram_size',
    PENALTY_ALPHA = 'penalty_alpha',
    NUM_BEAMS = 'num_beams',
    LENGTH_PENALTY = 'length_penalty',
    MIN_LENGTH = 'min_length',
    ENCODER_REPETITION_PENALTY = 'encoder_rep_pen',
    FREQUENCY_PENALTY = 'freq_pen',
    PRESENCE_PENALTY = 'presence_pen',
    DO_SAMPLE = 'do_sample',
    EARLY_STOPPING = 'early_stopping',
    ADD_BOS_TOKEN = 'add_bos_token',
    BAN_EOS_TOKEN = 'ban_eos_token',
    SKIP_SPECIAL_TOKENS = 'skip_special_tokens',
    STREAMING = 'streaming',
    MIROSTAT_MODE = 'mirostat_mode',
    MIROSTAT_TAU = 'mirostat_tau',
    MIROSTAT_ETA = 'mirostat_eta',
    GUIDANCE_SCALE = 'guidance_scale',
    NEGATIVE_PROMPT = 'negative_prompt',
    GRAMMAR_STRING = 'grammar_string',
    BANNED_TOKENS = 'banned_tokens',
    CONTEXT_LENGTH = 'max_length',
    GENERATED_LENGTH = 'genamt',
    DYNATEMP_RANGE = 'dynatemp_range',
    SMOOTHING_FACTOR = 'smoothing_factor',
    DRY_MULTIPLIER = 'dry_multiplier',
    DRY_BASE = 'dry_base',
    DRY_ALLOWED_LENGTH = 'dry_allowed_length',
    DRY_SEQUENCE_BREAK = 'dry_sequence_break',
    DRY_PENALTY_LAST_N = 'dry_penalty_last_n',
    XTC_THRESHOLD = 'xtc_threshold',
    XTC_PROBABILITY = 'xtc_probability',
    KEEP_ALIVE_DURATION = 'keep_alive_duration',

    // Reasoning API
    // This is mostly for OpenRouter compatibility:
    // https://openrouter.ai/docs/api-reference/chat-completion

    REASONING_EFFORT = 'reasoning_effort',
    REASONING_MAX_TOKENS = 'reasoning_max_tokens',
    REASONING_EXCLUDE = 'reasoning_exclude',

    ENABLE_THINKING = 'enable_thinking',
}

type InputType = 'slider' | 'textinput' | 'checkbox' | 'custom' | 'split' | 'selector'

type SamplerStringItem = { type: 'string'; default: string }

type SamplerObjectItem = { type: 'object'; default: object }

type SamplerBooleanItem = { type: 'boolean'; default: boolean }

type SamplerStringSelector<T extends readonly string[]> = {
    type: 'selector_string'
    values: T
    default: T[number]
}

/*
 * NUMERIC SAMPLER VALUES
 * ----------------------
 * Stored as STRINGS so that ANY value the user types into the textinput
 * is preserved exactly, with no floating-point precision loss and no
 * clamping. There is intentionally no min/max/step/precision/ignoreIf,
 * and no integer/float distinction.
 *
 * Valid examples:
 *   0.0000000001
 *   0.00000001
 *   9999999
 *   999999999999999999999999999
 *   -999999999999999999999999999
 *   9223372036854775807
 *   -9223372036854775808
 */
type SamplerNumberItem = {
    type: 'number'
    default: string
}

type SamplerStringArray = {
    type: 'string_array'
    default: string
    splitToken: string
}

type SamplerItemValues =
    | SamplerStringItem
    | SamplerBooleanItem
    | SamplerNumberItem
    | SamplerObjectItem
    | SamplerStringArray
    | SamplerStringSelector<readonly string[]>

export type SamplerItem = {
    internalID: SamplerID
    friendlyName: string
    inputType: InputType
    macro: string
    values: SamplerItemValues
}

function defineSamplers<T extends { [K in SamplerID]: SamplerItem }>(obj: T): T {
    return obj
}

export const Samplers = {
    /*Default Sampler definitions here*/

    [SamplerID.CONTEXT_LENGTH]: {
        internalID: SamplerID.CONTEXT_LENGTH,
        friendlyName: 'Max Context',
        inputType: 'textinput',
        macro: '{{max_context_length}}',
        values: {
            type: 'number',
            default: '8192',
        },
    },
    [SamplerID.STREAMING]: {
        internalID: SamplerID.STREAMING,
        friendlyName: 'Streaming',
        inputType: 'checkbox',
        macro: '{{stream}}',
        values: {
            type: 'boolean',
            default: true,
        },
    },
    [SamplerID.GENERATED_LENGTH]: {
        internalID: SamplerID.GENERATED_LENGTH,
        friendlyName: 'Generated Tokens',
        inputType: 'textinput',
        macro: '{{generted_length}}',
        values: {
            type: 'number',
            default: '256',
        },
    },
    [SamplerID.TEMPERATURE]: {
        internalID: SamplerID.TEMPERATURE,
        friendlyName: 'Temperature',
        inputType: 'textinput',
        macro: '{{temp}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.DYNATEMP_RANGE]: {
        internalID: SamplerID.DYNATEMP_RANGE,
        friendlyName: 'Dynamic Temperature Range',
        inputType: 'textinput',
        macro: '{{dynatemp_range}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.MIN_P]: {
        internalID: SamplerID.MIN_P,
        friendlyName: 'Min P',
        inputType: 'textinput',
        macro: '{{min_p}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.XTC_PROBABILITY]: {
        internalID: SamplerID.XTC_PROBABILITY,
        friendlyName: 'XTC Probability',
        inputType: 'textinput',
        macro: '{{xtc_p}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.XTC_THRESHOLD]: {
        internalID: SamplerID.XTC_THRESHOLD,
        friendlyName: 'XTC Threshold',
        inputType: 'textinput',
        macro: '{{xtc_t}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.TOP_P]: {
        internalID: SamplerID.TOP_P,
        friendlyName: 'Top P',
        inputType: 'textinput',
        macro: '{{top_p}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.TOP_A]: {
        internalID: SamplerID.TOP_A,
        friendlyName: 'Top A',
        inputType: 'textinput',
        macro: '{{top_a}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.TOP_K]: {
        internalID: SamplerID.TOP_K,
        friendlyName: 'Top K',
        inputType: 'textinput',
        macro: '{{top_k}}',
        values: {
            type: 'number',
            default: '100',
        },
    },
    [SamplerID.REPETITION_PENALTY]: {
        internalID: SamplerID.REPETITION_PENALTY,
        friendlyName: 'Repetition Penalty',
        inputType: 'textinput',
        macro: '{{rep_pen}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.REPETITION_PENALTY_RANGE]: {
        internalID: SamplerID.REPETITION_PENALTY_RANGE,
        friendlyName: 'Repetition Penalty Range',
        inputType: 'textinput',
        macro: '{{rep_pen_range}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.REPETITION_PENALTY_SLOPE]: {
        internalID: SamplerID.REPETITION_PENALTY_SLOPE,
        friendlyName: 'Repetition Penalty Slope',
        inputType: 'textinput',
        macro: '{{rep_pen_slope}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.ENCODER_REPETITION_PENALTY]: {
        internalID: SamplerID.ENCODER_REPETITION_PENALTY,
        friendlyName: 'Encoder Repetition Penalty',
        inputType: 'textinput',
        macro: '{{enc_rep_pen}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.FREQUENCY_PENALTY]: {
        internalID: SamplerID.FREQUENCY_PENALTY,
        friendlyName: 'Frequency Penalty',
        inputType: 'textinput',
        macro: '{{freq_pen}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.PRESENCE_PENALTY]: {
        internalID: SamplerID.PRESENCE_PENALTY,
        friendlyName: 'Presence Penalty',
        inputType: 'textinput',
        macro: '{{pres_pen}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.NO_REPEAT_NGRAM_SIZE]: {
        internalID: SamplerID.NO_REPEAT_NGRAM_SIZE,
        friendlyName: 'No Repeat Ngram Size',
        inputType: 'textinput',
        macro: '{{nrepeat_ngram_size}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.MIN_LENGTH]: {
        internalID: SamplerID.MIN_LENGTH,
        friendlyName: 'Minimum Length',
        inputType: 'textinput',
        macro: '{{min_length}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.SMOOTHING_FACTOR]: {
        internalID: SamplerID.SMOOTHING_FACTOR,
        friendlyName: 'Smoothing Factor',
        inputType: 'textinput',
        macro: '{{smooth_factor}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.TYPICAL]: {
        internalID: SamplerID.TYPICAL,
        friendlyName: 'Typical Sampling',
        inputType: 'textinput',
        macro: '{{typ}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.TAIL_FREE_SAMPLING]: {
        internalID: SamplerID.TAIL_FREE_SAMPLING,
        friendlyName: 'Tail-Free Sampling',
        inputType: 'textinput',
        macro: '{{tfs}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.EPSILON_CUTOFF]: {
        internalID: SamplerID.EPSILON_CUTOFF,
        friendlyName: 'Epsilon Cutoff',
        inputType: 'textinput',
        macro: '{{eps_cutoff}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.ETA_CUTOFF]: {
        internalID: SamplerID.ETA_CUTOFF,
        friendlyName: 'Eta Cutoff',
        inputType: 'textinput',
        macro: '{{eta_cutoff}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.MIROSTAT_MODE]: {
        internalID: SamplerID.MIROSTAT_MODE,
        friendlyName: 'Mirostat Mode',
        inputType: 'textinput',
        macro: '{{miro_mode}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.MIROSTAT_TAU]: {
        internalID: SamplerID.MIROSTAT_TAU,
        friendlyName: 'Mirostat Tau',
        inputType: 'textinput',
        macro: '{{miro_tau}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.MIROSTAT_ETA]: {
        internalID: SamplerID.MIROSTAT_ETA,
        friendlyName: 'Mirostat Eta',
        inputType: 'textinput',
        macro: '{{miro_eta}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.REASONING_EXCLUDE]: {
        internalID: SamplerID.REASONING_EXCLUDE,
        friendlyName: 'Exclude Reasoning',
        inputType: 'checkbox',
        macro: '{{exclude_reasoning}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.BAN_EOS_TOKEN]: {
        internalID: SamplerID.BAN_EOS_TOKEN,
        friendlyName: 'Ban EOS tokens',
        inputType: 'checkbox',
        macro: '{{ban_eos}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.ADD_BOS_TOKEN]: {
        internalID: SamplerID.ADD_BOS_TOKEN,
        friendlyName: 'Add BOS Token',
        inputType: 'checkbox',
        macro: '{{add_bos}}',
        values: {
            type: 'boolean',
            default: true,
        },
    },
    [SamplerID.DO_SAMPLE]: {
        internalID: SamplerID.DO_SAMPLE,
        friendlyName: 'Do Sample',
        inputType: 'checkbox',
        macro: '{{do_sample}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.SKIP_SPECIAL_TOKENS]: {
        internalID: SamplerID.SKIP_SPECIAL_TOKENS,
        friendlyName: 'Skip Special Token',
        inputType: 'checkbox',
        macro: '{{skip_special}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.SINGLE_LINE]: {
        internalID: SamplerID.SINGLE_LINE,
        friendlyName: 'Single Line',
        inputType: 'checkbox',
        macro: '{{single_line}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.GRAMMAR_STRING]: {
        internalID: SamplerID.GRAMMAR_STRING,
        friendlyName: 'Grammar',
        inputType: 'textinput',
        macro: '{{grammar}}',
        values: {
            type: 'string',
            default: '',
        },
    },
    [SamplerID.SEED]: {
        internalID: SamplerID.SEED,
        friendlyName: 'Seed',
        inputType: 'textinput',
        macro: '{{seed}}',
        values: {
            type: 'number',
            default: '-1',
        },
    },
    [SamplerID.KEEP_ALIVE_DURATION]: {
        internalID: SamplerID.KEEP_ALIVE_DURATION,
        friendlyName: 'Keep Alive Duration',
        inputType: 'textinput',
        macro: '{{keep_alive_duration}}',
        values: {
            type: 'number',
            default: '5',
        },
    },
    // THIS MAY BE AN ARRAY OBJECT
    [SamplerID.BANNED_TOKENS]: {
        internalID: SamplerID.BANNED_TOKENS,
        friendlyName: 'Banned Tokens',
        inputType: 'textinput',
        macro: '{{banned_tokens}}',
        values: {
            type: 'string',
            default: '',
        },
    },
    [SamplerID.GUIDANCE_SCALE]: {
        internalID: SamplerID.GUIDANCE_SCALE,
        friendlyName: 'CFG Scale',
        inputType: 'textinput',
        macro: '{{guidance_scale}}',
        values: {
            type: 'number',
            default: '0.01',
        },
    },
    [SamplerID.NEGATIVE_PROMPT]: {
        internalID: SamplerID.NEGATIVE_PROMPT,
        friendlyName: 'Negative Prompt',
        inputType: 'textinput',
        macro: '{{negative_prompt}}',
        values: {
            type: 'string',
            default: '',
        },
    },
    [SamplerID.NUM_BEAMS]: {
        internalID: SamplerID.NUM_BEAMS,
        friendlyName: 'Number of Beams',
        inputType: 'textinput',
        macro: '{{num_beams}}',
        values: {
            type: 'number',
            default: '1',
        },
    },
    [SamplerID.EARLY_STOPPING]: {
        internalID: SamplerID.EARLY_STOPPING,
        friendlyName: 'Early Stopping',
        inputType: 'checkbox',
        macro: '{{early_stopping}}',
        values: {
            type: 'boolean',
            default: false,
        },
    },
    [SamplerID.LENGTH_PENALTY]: {
        internalID: SamplerID.LENGTH_PENALTY,
        friendlyName: 'Length Penalty',
        inputType: 'textinput',
        macro: '{{length_pen}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.PENALTY_ALPHA]: {
        internalID: SamplerID.PENALTY_ALPHA,
        friendlyName: 'Penalty Alpha',
        inputType: 'textinput',
        macro: '{{alpha_pen}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.DRY_MULTIPLIER]: {
        internalID: SamplerID.DRY_MULTIPLIER,
        friendlyName: 'Dry Multiplier',
        inputType: 'textinput',
        macro: '{{dry_mult}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.DRY_BASE]: {
        internalID: SamplerID.DRY_BASE,
        friendlyName: 'Dry Base',
        inputType: 'textinput',
        macro: '{{dry_base}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.DRY_ALLOWED_LENGTH]: {
        internalID: SamplerID.DRY_ALLOWED_LENGTH,
        friendlyName: 'Dry Allowed Length',
        inputType: 'textinput',
        macro: '{{dry_length}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.DRY_SEQUENCE_BREAK]: {
        internalID: SamplerID.DRY_SEQUENCE_BREAK,
        friendlyName: 'Dry Sequence Break',
        inputType: 'textinput',
        macro: '{{dry_break}}',
        values: {
            type: 'string',
            default: '',
        },
    },
    [SamplerID.DRY_PENALTY_LAST_N]: {
        internalID: SamplerID.DRY_PENALTY_LAST_N,
        friendlyName: 'Dry Penalty Last N',
        inputType: 'textinput',
        macro: '{{dry_penalty_last_n}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.REASONING_EFFORT]: {
        internalID: SamplerID.REASONING_EFFORT,
        friendlyName: 'Reasoning Effort',
        inputType: 'selector',
        macro: '{{reasoning_effort}}',
        values: {
            type: 'selector_string',
            default: 'disabled',
            values: ['disabled', 'low', 'medium', 'high'],
        },
    },

    [SamplerID.REASONING_MAX_TOKENS]: {
        internalID: SamplerID.REASONING_MAX_TOKENS,
        friendlyName: 'Reasoning Tokens',
        inputType: 'textinput',
        macro: '{{reasoning_tokens}}',
        values: {
            type: 'number',
            default: '0',
        },
    },
    [SamplerID.ENABLE_THINKING]: {
        internalID: SamplerID.ENABLE_THINKING,
        friendlyName: 'Enable Thinking',
        inputType: 'checkbox',
        macro: '{{enable_thinking}}',
        values: {
            type: 'boolean',
            default: true,
        },
    },
} as const

// this is just to typecheck if Samplers contains all SamplerID's
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummy = () => {
    defineSamplers(Samplers)
}

type ValueType<V extends SamplerItemValues> =
    V extends SamplerStringSelector<infer T>
        ? T[number]
        : V extends SamplerStringItem
          ? string
          : V extends SamplerObjectItem
            ? object
            : V extends SamplerNumberItem
              ? string
              : boolean

type SamplerValueMap = {
    [ID in keyof typeof Samplers]: ValueType<(typeof Samplers)[ID]['values']>
}

export type SamplerConfigData = {
    -readonly [ID in keyof SamplerValueMap]: SamplerValueMap[ID]
}

export const createMarkdownRows = () => {
    const items: any = []
    Object.entries(Samplers).map(([k, v]) => {
        items.push('|' + v.friendlyName + '|' + v.internalID + '|' + v.macro + '|')
    })
    const out = items.join('\n')
    console.log(out)
}

export const defaultSamplerConfig = (Object.keys(Samplers) as SamplerID[])
    .map((key) => ({ id: key, value: Samplers[key].values.default }))
    .reduce((a, b) => (a = { ...a, [b.id]: b.value }), {}) as SamplerConfigData