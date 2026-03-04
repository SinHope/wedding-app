const BANNED_WORDS = [
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
    'cock', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'idiot',
    'stupid', 'motherfucker', 'piss', 'damn', 'hell', 'ass', 'arse', 'wanker',
    'twat', 'bollocks', 'prick', 'bugger', 'shitty', 'bullshit',
    // Malay offensive words
    'bodoh', 'bangang', 'celaka', 'sial', 'pukimak', 'lancau', 'babi',
    'anjing', 'kepala bapak', 'pundek', 'kimak'
]

/**
 * Returns true if the text contains any banned words.
 * Uses whole-word matching to avoid false positives.
 */
export const containsProfanity = (text) => {
    if (!text) return false
    const lower = text.toLowerCase()
    return BANNED_WORDS.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i')
        return regex.test(lower)
    })
}
