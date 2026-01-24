import api from './axios';

export const login = async (email, password) => {
    const params = new URLSearchParams();
    // OAuth2PasswordRequestForm expects form data
    // Using json for simplicity unless we used Form in backend... 
    // Wait, backend uses OAuth2PasswordRequestForm which requires form data
    // But my UserLogin model expects JSON. Let's check backend auth.py
    // Checking auth.py: router.post("/login", response_model=Token) async def login(user: UserLogin):
    // It expects JSON body (UserLogin model), NOT OAuth2PasswordRequestForm (which is used in the specific /token endpoint usually).
    // So JSON is correct.
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const firebaseLogin = async (token) => {
    const response = await api.post('/auth/firebase-login', { token });
    return response.data;
};
