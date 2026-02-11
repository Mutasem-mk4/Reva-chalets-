// Mock Request global
class MockRequest {
    url: string;
    method: string;
    headers: Headers;
    body: any;

    constructor(input: string, init?: any) {
        this.url = input;
        this.method = init?.method || 'GET';
        this.headers = new Headers(init?.headers);
        this.body = init?.body;
    }

    async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
}
global.Request = MockRequest as any;

// Mock Headers
class MockHeaders {
    map: Record<string, string> = {};
    constructor(init?: any) {
        if (init) Object.assign(this.map, init);
    }
    get(name: string) { return this.map[name] || null; }
}
global.Headers = MockHeaders as any;

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: (body: any, init?: any) => ({
            status: init?.status || 200,
            json: async () => body,
        }),
    },
}));

// Mock Supabase server client
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => Promise.resolve({
        auth: {
            signInWithPassword: mockSignInWithPassword,
            signUp: mockSignUp,
        },
    })),
}));

// Import after mocking
import { POST as loginHandler } from './login/route';
import { POST as signupHandler } from './signup/route';

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 400 if email or password missing', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: '' }),
        });

        const res = await loginHandler(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe('Email and password are required');
    });

    it('returns 401 for invalid credentials', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials' },
        });

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'bad@test.com', password: 'wrong' }),
        });

        const res = await loginHandler(req);
        expect(res.status).toBe(401);

        const data = await res.json();
        expect(data.error).toBe('Invalid login credentials');
    });

    it('returns user data on successful login', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: {
                user: {
                    id: 'user-123',
                    email: 'user@test.com',
                    user_metadata: { name: 'Ahmad', role: 'USER' },
                },
                session: { access_token: 'token-abc' },
            },
            error: null,
        });

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'user@test.com', password: 'correct' }),
        });

        const res = await loginHandler(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.user).toEqual({
            id: 'user-123',
            email: 'user@test.com',
            name: 'Ahmad',
            role: 'USER',
        });
        expect(data.token).toBe('token-abc');
    });
});

describe('POST /api/auth/signup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 400 if email or password missing', async () => {
        const req = new Request('http://localhost/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com' }),
        });

        const res = await signupHandler(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe('Email and password are required');
    });

    it('returns 400 for duplicate email', async () => {
        mockSignUp.mockResolvedValue({
            data: { user: null },
            error: { message: 'User already registered' },
        });

        const req = new Request('http://localhost/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'exists@test.com', password: 'pass123', name: 'Test' }),
        });

        const res = await signupHandler(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe('User already registered');
    });

    it('returns success on valid signup', async () => {
        mockSignUp.mockResolvedValue({
            data: {
                user: { id: 'new-user', email: 'new@test.com' },
            },
            error: null,
        });

        const req = new Request('http://localhost/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'new@test.com', password: 'pass123', name: 'New User', role: 'HOST' }),
        });

        const res = await signupHandler(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.user.id).toBe('new-user');
        expect(data.user.email).toBe('new@test.com');
        expect(data.user.name).toBe('New User');
        expect(data.message).toContain('Check your email');
    });
});
