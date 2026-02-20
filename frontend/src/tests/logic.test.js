import { describe, it, expect } from 'vitest';

// --- Tests per a la lògica d'assistència ---
describe('Attendance Metrics Logic', () => {

    const calcPercentage = (students) => {
        const presents = students.filter(s => s.estat === 'present').length;
        const absents = students.filter(s => s.estat === 'absent').length;
        const total = presents + absents;
        if (total === 0) return 0;
        return Math.round((presents / total) * 100);
    };

    it('should return 0% when all students are pending', () => {
        const students = [
            { id: 1, estat: 'pendent' },
            { id: 2, estat: 'pendent' },
        ];
        expect(calcPercentage(students)).toBe(0);
    });

    it('should return 100% when all students are present', () => {
        const students = [
            { id: 1, estat: 'present' },
            { id: 2, estat: 'present' },
        ];
        expect(calcPercentage(students)).toBe(100);
    });

    it('should return 0% when all students are absent', () => {
        const students = [
            { id: 1, estat: 'absent' },
            { id: 2, estat: 'absent' },
        ];
        expect(calcPercentage(students)).toBe(0);
    });

    it('should ignore retard when calculating percentage', () => {
        const students = [
            { id: 1, estat: 'present' },
            { id: 2, estat: 'retard' },
            { id: 3, estat: 'pendent' },
        ];
        // Only present=1, absent=0. Total marked = 1
        expect(calcPercentage(students)).toBe(100);
    });

    it('should compute 50% correctly', () => {
        const students = [
            { id: 1, estat: 'present' },
            { id: 2, estat: 'absent' },
        ];
        expect(calcPercentage(students)).toBe(50);
    });

    it('should handle mixed group correctly', () => {
        const students = [
            { id: 1, estat: 'present' },
            { id: 2, estat: 'present' },
            { id: 3, estat: 'absent' },
            { id: 4, estat: 'retard' },
            { id: 5, estat: 'pendent' },
        ];
        // presents=2, absents=1, total=3 → 67%
        expect(calcPercentage(students)).toBe(67);
    });
});

// --- Tests per a la lògica de grups aleatoris ---
describe('Random Group Generator Logic', () => {

    const generateGroups = (students, perGroup) => {
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const groups = [];
        for (let i = 0; i < shuffled.length; i += perGroup) {
            groups.push(shuffled.slice(i, i + perGroup));
        }
        return groups;
    };

    const students = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, nom: `Alumne ${i + 1}` }));

    it('should group all students', () => {
        const groups = generateGroups(students, 3);
        const total = groups.reduce((sum, g) => sum + g.length, 0);
        expect(total).toBe(students.length);
    });

    it('should create correct number of groups', () => {
        const groups = generateGroups(students, 5);
        expect(groups.length).toBe(2);
    });

    it('should create partial last group if not divisible', () => {
        const groups = generateGroups(students, 3);
        // 10 students / 3 perGroup = 3 full groups (3,3,3) + 1 partial (1)
        expect(groups.length).toBe(4);
        expect(groups[groups.length - 1].length).toBeLessThanOrEqual(3);
    });

    it('should not duplicate students across groups', () => {
        const groups = generateGroups(students, 4);
        const allIds = groups.flat().map(s => s.id);
        const uniqueIds = new Set(allIds);
        expect(uniqueIds.size).toBe(students.length);
    });
});

// --- Tests per a la lògica de filtratge d'alumnes ---
describe('Student Search Filter Logic', () => {

    const filter = (students, query) => {
        if (!query) return students;
        const q = query.toLowerCase();
        return students.filter(s =>
            s.nom.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
    };

    const students = [
        { id: 1, nom: 'Marc Roig', email: 'marcroig@example.com' },
        { id: 2, nom: 'Laia Sols', email: 'laiais@example.com' },
        { id: 3, nom: 'Pol Vila', email: 'polvila@example.com' },
    ];

    it('should return all students when query is empty', () => {
        expect(filter(students, '')).toHaveLength(3);
    });

    it('should filter by name (case insensitive)', () => {
        expect(filter(students, 'marc')).toHaveLength(1);
        expect(filter(students, 'MARC')).toHaveLength(1);
    });

    it('should filter by email', () => {
        expect(filter(students, 'polvila')).toHaveLength(1);
    });

    it('should return empty array when no match', () => {
        expect(filter(students, 'xxxxxx')).toHaveLength(0);
    });

    it('should match partial string in name', () => {
        expect(filter(students, 'la')).toHaveLength(2); // Laia + Vila contains 'la'
    });
});
