import crypto from 'crypto';

const SECRET = 'VIKASH_REST_API';

export const random = () => {
    return crypto.randomBytes(16).toString('base64');
};

export const authentication = (password: string, salt: string) => {
    return crypto
        .createHmac('sha256', [salt, password].join('/'))
        .update(SECRET)
        .digest('hex');
};
