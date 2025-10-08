import NaomisConfig from '@nhcarrigan/eslint-config';

export default [
    ...NaomisConfig,
    {
        rules: {
            "no-console" : "off",
            "no-await-in-loop": "off",
        }
    }
];