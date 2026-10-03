```
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

    REASONING_EFFORT = 'reasoning_effort',
    REASONING_MAX_TOKENS = 'reasoning_max_tokens',
    REASONING_EXCLUDE = 'reasoning_exclude',

    ENABLE_THINKING = 'enable_thinking',
}

type InputType =
    | 'textinput'
    | 'checkbox'
    | 'custom'
    | 'split'
    | 'selector'

type SamplerStringItem = {
    type: 'string'
    default: string
}

type SamplerObjectItem = {
    type: 'object'
    default: object
}

type SamplerBooleanItem = {
    type: 'boolean'
    default: boolean
}

type SamplerStringSelector<T extends readonly string[]> = {
    type: 'selector_string'
    values: T
    default: T[number]
}

/*
 * Numeric values are kept as numbers for normal floating-point
 * sampler parameters.
 *
 * Integer values may contain the complete signed int64 range.
 * They are therefore represented as strings so JavaScript does not
 * lose precision above Number.MAX_SAFE_INTEGER.
 */
type SamplerIntegerItem = {
    type: 'integer'
    default: string
    min?: string
    max?: string
    step?: string
    precision: 0
    ignoreIf: string
}

type SamplerFloatItem = {
    type: 'float'
    default: number
    min?: number
    max?: number
    step?: number
    precision: number
    ignoreIf: number
}

type SamplerNumberItem = SamplerIntegerItem | SamplerFloatItem

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

function defineSamplers<T extends { [K in SamplerID]: SamplerItem }>(
    obj: T
): T {
    return obj
}

/*
 * Full signed int64 range:
 *
 * -9223372036854775808
 *  9223372036854775807
 *
 * Values are strings intentionally.
 *
 * Do NOT use Number(), parseInt(), or parseFloat() on these values.
 */
export const INT64_MIN = '-9223372036854775808'
export const INT64_MAX = '9223372036854775807'

export const Samplers = defineSamplers({
    [SamplerID.CONTEXT_LENGTH]: {
        internalID: SamplerID.CONTEXT_LENGTH,
        friendlyName: 'Max Context',
        inputType: 'textinput',
        macro: '{{max_context_length}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '8192',
            step: '1',
            precision: 0,
            ignoreIf: '0',
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
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '256',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.TEMPERATURE]: {
        internalID: SamplerID.TEMPERATURE,
        friendlyName: 'Temperature',
        inputType: 'textinput',
        macro: '{{temp}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.DYNATEMP_RANGE]: {
        internalID: SamplerID.DYNATEMP_RANGE,
        friendlyName: 'Dynamic Temperature Range',
        inputType: 'textinput',
        macro: '{{dynatemp_range}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.MIN_P]: {
        internalID: SamplerID.MIN_P,
        friendlyName: 'Min P',
        inputType: 'textinput',
        macro: '{{min_p}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.XTC_PROBABILITY]: {
        internalID: SamplerID.XTC_PROBABILITY,
        friendlyName: 'XTC Probability',
        inputType: 'textinput',
        macro: '{{xtc_p}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.XTC_THRESHOLD]: {
        internalID: SamplerID.XTC_THRESHOLD,
        friendlyName: 'XTC Threshold',
        inputType: 'textinput',
        macro: '{{xtc_t}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.TOP_P]: {
        internalID: SamplerID.TOP_P,
        friendlyName: 'Top P',
        inputType: 'textinput',
        macro: '{{top_p}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.TOP_A]: {
        internalID: SamplerID.TOP_A,
        friendlyName: 'Top A',
        inputType: 'textinput',
        macro: '{{top_a}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.TOP_K]: {
        internalID: SamplerID.TOP_K,
        friendlyName: 'Top K',
        inputType: 'textinput',
        macro: '{{top_k}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '100',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.REPETITION_PENALTY]: {
        internalID: SamplerID.REPETITION_PENALTY,
        friendlyName: 'Repetition Penalty',
        inputType: 'textinput',
        macro: '{{rep_pen}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 1,
        },
    },

    [SamplerID.REPETITION_PENALTY_RANGE]: {
        internalID: SamplerID.REPETITION_PENALTY_RANGE,
        friendlyName: 'Repetition Penalty Range',
        inputType: 'textinput',
        macro: '{{rep_pen_range}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '1',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.REPETITION_PENALTY_SLOPE]: {
        internalID: SamplerID.REPETITION_PENALTY_SLOPE,
        friendlyName: 'Repetition Penalty Slope',
        inputType: 'textinput',
        macro: '{{rep_pen_slope}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.ENCODER_REPETITION_PENALTY]: {
        internalID: SamplerID.ENCODER_REPETITION_PENALTY,
        friendlyName: 'Encoder Repetition Penalty',
        inputType: 'textinput',
        macro: '{{enc_rep_pen}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.FREQUENCY_PENALTY]: {
        internalID: SamplerID.FREQUENCY_PENALTY,
        friendlyName: 'Frequency Penalty',
        inputType: 'textinput',
        macro: '{{freq_pen}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.PRESENCE_PENALTY]: {
        internalID: SamplerID.PRESENCE_PENALTY,
        friendlyName: 'Presence Penalty',
        inputType: 'textinput',
        macro: '{{pres_pen}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.NO_REPEAT_NGRAM_SIZE]: {
        internalID: SamplerID.NO_REPEAT_NGRAM_SIZE,
        friendlyName: 'No Repeat Ngram Size',
        inputType: 'textinput',
        macro: '{{nrepeat_ngram_size}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.MIN_LENGTH]: {
        internalID: SamplerID.MIN_LENGTH,
        friendlyName: 'Minimum Length',
        inputType: 'textinput',
        macro: '{{min_length}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.SMOOTHING_FACTOR]: {
        internalID: SamplerID.SMOOTHING_FACTOR,
        friendlyName: 'Smoothing Factor',
        inputType: 'textinput',
        macro: '{{smooth_factor}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.TYPICAL]: {
        internalID: SamplerID.TYPICAL,
        friendlyName: 'Typical Sampling',
        inputType: 'textinput',
        macro: '{{typ}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.TAIL_FREE_SAMPLING]: {
        internalID: SamplerID.TAIL_FREE_SAMPLING,
        friendlyName: 'Tail-Free Sampling',
        inputType: 'textinput',
        macro: '{{tfs}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 1,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.EPSILON_CUTOFF]: {
        internalID: SamplerID.EPSILON_CUTOFF,
        friendlyName: 'Epsilon Cutoff',
        inputType: 'textinput',
        macro: '{{eps_cutoff}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.ETA_CUTOFF]: {
        internalID: SamplerID.ETA_CUTOFF,
        friendlyName: 'Eta Cutoff',
        inputType: 'textinput',
        macro: '{{eta_cutoff}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.MIROSTAT_MODE]: {
        internalID: SamplerID.MIROSTAT_MODE,
        friendlyName: 'Mirostat Mode',
        inputType: 'textinput',
        macro: '{{miro_mode}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.MIROSTAT_TAU]: {
        internalID: SamplerID.MIROSTAT_TAU,
        friendlyName: 'Mirostat Tau',
        inputType: 'textinput',
        macro: '{{miro_tau}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.MIROSTAT_ETA]: {
        internalID: SamplerID.MIROSTAT_ETA,
        friendlyName: 'Mirostat Eta',
        inputType: 'textinput',
        macro: '{{miro_eta}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
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
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '-1',
            step: '1',
            precision: 0,
            ignoreIf: '-1',
        },
    },

    [SamplerID.KEEP_ALIVE_DURATION]: {
        internalID: SamplerID.KEEP_ALIVE_DURATION,
        friendlyName: 'Keep Alive Duration',
        inputType: 'textinput',
        macro: '{{keep_alive_duration}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '5',
            step: '1',
            precision: 0,
            ignoreIf: '-1',
        },
    },

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
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0.01,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
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
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '1',
            step: '1',
            precision: 0,
            ignoreIf: '0',
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
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.1,
            precision: 1,
            ignoreIf: 0,
        },
    },

    [SamplerID.PENALTY_ALPHA]: {
        internalID: SamplerID.PENALTY_ALPHA,
        friendlyName: 'Penalty Alpha',
        inputType: 'textinput',
        macro: '{{alpha_pen}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.DRY_MULTIPLIER]: {
        internalID: SamplerID.DRY_MULTIPLIER,
        friendlyName: 'Dry Multiplier',
        inputType: 'textinput',
        macro: '{{dry_mult}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.DRY_BASE]: {
        internalID: SamplerID.DRY_BASE,
        friendlyName: 'Dry Base',
        inputType: 'textinput',
        macro: '{{dry_base}}',
        values: {
            type: 'float',
            min: -Infinity,
            max: Infinity,
            default: 0,
            step: 0.01,
            precision: 2,
            ignoreIf: 0,
        },
    },

    [SamplerID.DRY_ALLOWED_LENGTH]: {
        internalID: SamplerID.DRY_ALLOWED_LENGTH,
        friendlyName: 'Dry Allowed Length',
        inputType: 'textinput',
        macro: '{{dry_length}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
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
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.REASONING_EFFORT]: {
        internalID: SamplerID.REASONING_EFFORT,
        friendlyName: 'Reasoning Effort',
        inputType: 'textinput',
        macro: '{{reasoning_effort}}',
        values: {
            type: 'string',
            default: '',
        },
    },

    [SamplerID.REASONING_MAX_TOKENS]: {
        internalID: SamplerID.REASONING_MAX_TOKENS,
        friendlyName: 'Reasoning Max Tokens',
        inputType: 'textinput',
        macro: '{{reasoning_max_tokens}}',
        values: {
            type: 'integer',
            min: INT64_MIN,
            max: INT64_MAX,
            default: '0',
            step: '1',
            precision: 0,
            ignoreIf: '0',
        },
    },

    [SamplerID.ENABLE_THINKING]: {
        internalID: SamplerID.ENABLE_THINKING,
        friendlyName: 'Enable Thinking',
        inputType: 'checkbox',
        macro: '{{enable_thinking}}',
        values: {
            type: 'boolean',
            default: false,
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
})

export type SamplerConfigData = {
    [key in SamplerID]?: string | number | boolean | object
}

export const defaultSamplerConfig: SamplerConfigData = Object.fromEntries(
    Object.values(SamplerID).map((id) => {
        const sampler = Samplers[id]

        switch (sampler.values.type) {
            case 'boolean':
                return [id, sampler.values.default]

            case 'string':
            case 'string_array':
                return [id, sampler.values.default]

            case 'integer':
                return [id, sampler.values.default]

            case 'float':
                return [id, sampler.values.default]

            case 'object':
                return [id, sampler.values.default]

            case 'selector_string':
                return [id, sampler.values.default]

            default:
                return [id, '']
        }
    })
) as SamplerConfigData

export function isInt64(value: string): boolean {
    if (!/^-?\d+$/.test(value.trim())) {
        return false
    }

    try {
        const number = BigInt(value.trim())
        const minimum = BigInt(INT64_MIN)
        const maximum = BigInt(INT64_MAX)

        return number >= minimum && number <= maximum
    } catch {
        return false
    }
}

export function normalizeInt64(value: unknown): string {
    if (typeof value === 'bigint') {
        const stringValue = value.toString()

        if (!isInt64(stringValue)) {
            return '0'
        }

        return stringValue
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            return '0'
        }

        /*
         * A number may already have lost precision before reaching here.
         * This is only a compatibility conversion for old configs.
         */
        const stringValue = String(value)

        return isInt64(stringValue) ? stringValue : '0'
    }

    if (typeof value === 'string') {
        const stringValue = value.trim()

        if (isInt64(stringValue)) {
            return stringValue
        }
    }

    return '0'
}

export function parseInt64(value: string): bigint {
    const normalized = value.trim()

    if (!isInt64(normalized)) {
        throw new RangeError(
            `Invalid int64 value: ${value}`
        )
    }

    return BigInt(normalized)
}

export function fixSamplerConfig(
    config: SamplerConfigData
): SamplerConfigData {
    const fixed: SamplerConfigData = {
        ...config,
    }

    for (const key of Object.values(SamplerID)) {
        const sampler = Samplers[key]
        const current = fixed[key]

        if (current === undefined || current === null) {
            fixed[key] = sampler.values.default
            continue
        }

        if (sampler.values.type === 'integer') {
            fixed[key] = normalizeInt64(current)
            continue
        }

        if (sampler.values.type === 'float') {
            if (typeof current === 'number' && Number.isFinite(current)) {
                fixed[key] = current
                continue
            }

            if (typeof current === 'string') {
                const parsed = Number(current)

                if (Number.isFinite(parsed)) {
                    fixed[key] = parsed
                    continue
                }
            }

            fixed[key] = sampler.values.default
            continue
        }
    }

    return fixed
}
```
