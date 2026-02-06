// Spell data for the convention game
const SPELLS = [
    { id: 'fast', name: 'Fast', effect: 'Move to There and still act, 1 round' },
    { id: 'slow', name: 'Slow', effect: 'Move or act (not both), 1 round' },
    { id: 'shrink', name: 'Shrink', effect: '1/10 size (target ≤ your size)' },
    { id: 'grow', name: 'Grow', effect: 'Double size, +1 STR' },
    { id: 'hold', name: 'Hold', effect: 'Target immobile, 1 round' },
    { id: 'blast', name: 'Blast', effect: "Cone, all targets Here in front of you" },
    { id: 'shot', name: 'Shot', effect: "Ranged, targets Here or There" },
    { id: 'shield', name: 'Shield', effect: 'Block/reduce damage, 1 round' },
    { id: 'float', name: 'Float', effect: 'Lift target off ground' },
    { id: 'push', name: 'Push', effect: "Knock target prone" },
    { id: 'mend', name: 'Mend', effect: 'Heal 1 heart (2 on 11+)' },
    { id: 'veil', name: 'Veil', effect: 'Create illusion or disguise' },
    { id: 'sense', name: 'Sense', effect: 'Detect hidden things or lies' },
    { id: 'silence', name: 'Silence', effect: 'Target can\'t make sound, 1 round' }
];

// Example ancestries for suggestions
const ANCESTRIES = [
    'Human', 'Dwarf', 'Elf', 'Halfling', 'Orc', 'Goblin', 'Tiefling', 'Gnome'
];

// Example backgrounds for suggestions
const BACKGROUNDS = [
    'Alchemist', 'Soldier', 'Merchant', 'Scholar', 'Thief', 'Blacksmith',
    'Sailor', 'Hunter', 'Healer', 'Entertainer', 'Noble', 'Farmer'
];

// Example talents for suggestions
const TALENTS = [
    'solving riddles', 'climbing', 'fast-talking', 'sneaking',
    'reading people', 'tracking', 'cooking', 'haggling',
    'intimidation', 'first aid', 'navigation', 'forgery'
];

// Example flaws for suggestions
const FLAWS = [
    'misses what\'s in front of my face',
    'can\'t resist a challenge',
    'trusts too easily',
    'speaks before thinking',
    'afraid of heights',
    'greedy for gold',
    'overconfident in combat',
    'terrible liar'
];
