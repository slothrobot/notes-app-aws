const config = {
    SENTRY_DSN:'https://e9b823aa68e44009988efd24a4f343e6@o4504453697568768.ingest.sentry.io/4504453702221824',
    MAX_ATTACHMENT_SIZE: 5000000,
    STRIPE_KEY: 'pk_test_51MLqWsClH6VK1ofNFffmjAzUOzXMocSuc9lpKSdMuyZy2fCt8z7yHYpx8Im1JtIIUarPRhpu8y6MLjWUKYE8O5pP003OGGWuS6',
    //Backend config
    s3:{
        REGION: process.env.REACT_APP_REGION,
        BUCKET: process.env.REACT_APP_BUCKET,
    },
    apiGateway: {
        REGION: process.env.REACT_APP_REGION,
        URL: process.env.REACT_APP_API_URL,
    },
    cognito: {
        REGION: process.env.REACT_APP_REGION,
        USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
        APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
    },    
};

export default config;