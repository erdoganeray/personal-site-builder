/**
 * Gemini API Error Handler
 * 
 * Converts raw Gemini API errors into user-friendly messages
 * that are safe to display in the UI without leaking implementation details.
 */

export interface UserFriendlyError {
    /** User-facing message (Turkish) */
    message: string;
    /** Error category for potential UI styling */
    category: 'quota' | 'model' | 'network' | 'parse' | 'api_key' | 'unknown';
    /** Whether the user should retry */
    shouldRetry: boolean;
    /** Suggested wait time in seconds (for rate limit errors) */
    retryAfterSeconds?: number;
}

/**
 * Parse Gemini API error and return a user-friendly error object
 */
export function parseGeminiError(error: unknown): UserFriendlyError {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for rate limit / quota errors (429)
    if (errorMessage.includes('429') ||
        errorMessage.includes('Too Many Requests') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('Quota exceeded')) {

        // Try to extract retry time
        const retryMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

        return {
            message: `İstek limiti aşıldı. Lütfen ${retrySeconds} saniye bekleyip tekrar deneyin.`,
            category: 'quota',
            shouldRetry: true,
            retryAfterSeconds: retrySeconds
        };
    }

    // Check for model not found errors (404)
    if (errorMessage.includes('404') ||
        errorMessage.includes('Not Found') ||
        errorMessage.includes('is not found') ||
        errorMessage.includes('not supported')) {
        return {
            message: 'AI servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
            category: 'model',
            shouldRetry: true
        };
    }

    // Check for API key errors (401/403)
    if (errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('API_KEY') ||
        errorMessage.includes('api key')) {
        return {
            message: 'AI servisi yapılandırma hatası. Lütfen destek ekibiyle iletişime geçin.',
            category: 'api_key',
            shouldRetry: false
        };
    }

    // Check for network errors
    if (errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('network') ||
        errorMessage.includes('fetch')) {
        return {
            message: 'Bağlantı hatası oluştu. İnternet bağlantınızı kontrol edip tekrar deneyin.',
            category: 'network',
            shouldRetry: true
        };
    }

    // Check for JSON parse errors
    if (errorMessage.includes('JSON') ||
        errorMessage.includes('parse') ||
        errorMessage.includes('Parse')) {
        return {
            message: 'AI yanıtı işlenemedi. Lütfen tekrar deneyin.',
            category: 'parse',
            shouldRetry: true
        };
    }

    // Check for Google Generative AI specific errors
    if (errorMessage.includes('GoogleGenerativeAI Error')) {
        // Generic Google AI error - hide technical details
        return {
            message: 'AI servisi şu anda meşgul. Lütfen birkaç saniye bekleyip tekrar deneyin.',
            category: 'unknown',
            shouldRetry: true
        };
    }

    // Default fallback for unknown errors
    return {
        message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        category: 'unknown',
        shouldRetry: true
    };
}

/**
 * Get user-friendly error message from any error
 * This is a convenience function that just returns the message string
 */
export function getGeminiErrorMessage(error: unknown): string {
    return parseGeminiError(error).message;
}

/**
 * Wrap a Gemini API call and convert errors to user-friendly format
 */
export async function withGeminiErrorHandling<T>(
    operation: () => Promise<T>,
    customFallbackMessage?: string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        const userError = parseGeminiError(error);
        throw new Error(customFallbackMessage || userError.message);
    }
}

/**
 * Check if an error is a rate limit error that can be retried
 */
export function isRateLimitError(error: unknown): boolean {
    const parsed = parseGeminiError(error);
    return parsed.category === 'quota';
}

/**
 * Get retry delay in milliseconds for rate limit errors
 */
export function getRetryDelayMs(error: unknown): number {
    const parsed = parseGeminiError(error);
    return (parsed.retryAfterSeconds || 60) * 1000;
}
