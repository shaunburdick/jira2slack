import shaunburdick from 'eslint-config-shaunburdick';
import globals from 'globals';


export default [
    ...shaunburdick.config.js,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
            //     ...globals.browser,
                ...globals.node,
                // myCustomGlobal: "readonly"
            }
        }
        // ...other config
    }
];
