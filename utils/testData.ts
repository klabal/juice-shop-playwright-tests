// utils/testData.ts
export const users = {
    valid: {
        email: 'test@example.com',
        password: 'Test123-',
    },
    invalid: {
        email: 'demo',
        password: 'password',
    },
   
};
export const searchTerms = [
    // Valid/expected terms
    'apple', 'Apple Juice', 'banana', 'lemon', 'juice', 'carrot',

    // Partial/fuzzy matches
    'app', 'ban', 'lem', 'jui',

    // Invalid and nonsense
    'xasdasd', '%', '#', '     ', 'null', 'undefined', 'DROP TABLE products;',

    // Random
    '☠☠☠☠', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'search', '../', '~/',
    "'; alert(1); //", 'アッポージュース',

    // Descriptive semantic
    'fruit', 'organic', 'sugar-free', 'vegan', 'snack',

    // Stress loop tests
    'a'.repeat(200), '🍕'.repeat(30), '0xdeadbeef', '💙'.repeat(10),

    // 🔍 Meta/meta
    'mat-icon', 'getByText', 'test', 'nope', 'thing', 'click',

    // Edge-case tags
    '<script>', '{test}', '"search term"', '`template`'
];