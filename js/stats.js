// Stat rolling and bonus calculation
const STAT_NAMES = ['STR', 'DEX', 'CON', 'WIS', 'INT', 'CHA'];

const Stats = {
    // Create empty stats object
    createEmpty() {
        return {
            STR: null,
            DEX: null,
            CON: null,
            WIS: null,
            INT: null,
            CHA: null
        };
    },

    // Get list of unassigned stats
    getUnassigned(stats) {
        return STAT_NAMES.filter(name => stats[name] === null);
    },

    // Get list of assigned stats with values
    getAssigned(stats) {
        return STAT_NAMES
            .filter(name => stats[name] !== null)
            .map(name => ({ name, value: stats[name] }));
    },

    // Check if all stats are assigned
    isComplete(stats) {
        return STAT_NAMES.every(name => stats[name] !== null);
    },

    // Calculate bonuses for completed stats
    calculateBonuses(stats) {
        if (!this.isComplete(stats)) return null;

        const values = Object.values(stats);
        const highest = Math.max(...values);
        const lowest = Math.min(...values);

        // Count occurrences of each value for duplicate detection
        const counts = {};
        values.forEach(v => {
            counts[v] = (counts[v] || 0) + 1;
        });

        // Calculate bonus for each stat
        const bonuses = {};
        STAT_NAMES.forEach(name => {
            const value = stats[name];
            let bonus = 0;

            // Highest gets +2
            if (value === highest) {
                bonus += 2;
            }
            // Lowest gets -1
            if (value === lowest) {
                bonus -= 1;
            }
            // Matching values get +1 each
            if (counts[value] >= 2) {
                bonus += 1;
            }

            bonuses[name] = bonus;
        });

        return bonuses;
    },

    // Format bonus as string (+2, -1, +0)
    formatBonus(bonus) {
        if (bonus > 0) return `+${bonus}`;
        if (bonus < 0) return `${bonus}`;
        return '+0';
    },

    // Validate a dice roll (3d6 = 3-18)
    isValidRoll(value) {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 3 && num <= 18;
    },

    // Calculate health based on CON bonus
    calculateHealth(bonuses) {
        const conBonus = bonuses.CON || 0;
        return Math.max(2, 3 + conBonus); // Minimum 2 hearts
    }
};
