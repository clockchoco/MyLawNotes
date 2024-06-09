import crypto from 'crypto';

export default function Verify(token, SECRET_KEY) {

    const [header, payload, signature] = token.split('.');

    const data = `${header}.${payload}`;
    const newSignature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return newSignature === signature
}