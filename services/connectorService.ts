import { NodeType } from '../types';

export interface ConnectionResult {
    success: boolean;
    message: string;
}

export const testConnection = async (
    type: NodeType,
    subtype: string | undefined,
    config: Record<string, string>
): Promise<ConnectionResult> => {
    try {
        const response = await fetch('/api/connect/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, subtype, config }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Connection test failed:', error);
        return { success: false, message: 'Failed to connect to backend service.' };
    }
};
