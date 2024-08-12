module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Spécifiez que Jest doit chercher les tests uniquement dans le dossier 'src'
    roots: ['<rootDir>/src'],

    // Ignorer les tests dans le dossier 'dist'
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],

    // Configuration du préprocesseur TypeScript
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },

    // Définir les extensions de fichiers que Jest doit reconnaître
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],

    // Si vous utilisez des modules de style ES dans les tests (optionnel)
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // Indique à Jest de ne pas transformer ces répertoires (surtout node_modules)
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // Spécifie les fichiers pour lesquels vous souhaitez collecter la couverture
        '!src/**/*.d.ts',    // Exclure les fichiers de définition TypeScript
        '!src/**/index.ts',  // Exemple pour exclure certains fichiers spécifiques
    ],
    coverageDirectory: 'coverage', // Le répertoire où Jest stocke les rapports de couverture
    coverageReporters: ['html', 'text-summary'], // Spécifie les formats de sortie des rapports de couverture
};