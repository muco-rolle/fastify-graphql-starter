enum DurationType {
    MINS = 'MINS',
    DAYS = 'DAYS',
}

/**
 * Get minutes in milliseconds
 * @param mins
 */
export const mins = (mins: number) => 60 * mins * 1000;

/**
 * Get days in milliseconds
 * @param days
 */
export const days = (days: number) => 60 * 60 * 24 * days * 1000;

export const duration = (
    type: keyof typeof DurationType,
    durationNumber: number
) => {
    switch (type) {
        case 'MINS':
            return 60 * durationNumber * 1000;
        case 'DAYS':
            return 60 * 60 * 24 * durationNumber * 1000;
        default:
            return 60 * durationNumber * 1000;
    }
};
