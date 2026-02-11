import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// Polyfill for Request/Response if not present (Node < 18 or specific JSDOM issues)
if (typeof global.Request === 'undefined') {
    try {
        const { Request, Response, Headers } = require('undici');
        // @ts-ignore
        global.Request = Request;
        // @ts-ignore
        global.Response = Response;
        // @ts-ignore
        global.Headers = Headers;
    } catch {
        // undici not available, skip polyfill (Node 18+ has native support)
    }
}
