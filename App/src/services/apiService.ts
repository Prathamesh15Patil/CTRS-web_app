const BASE_URL = 'https://rahul-samedavar-tomato-be.hf.space';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const decodeJWT = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers: {
      ...jsonHeaders,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed ${response.status} : ${errorText}`);
  }

  return (await response.json()) as T;
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
        email: payload.email,
        password: payload.password,
    })
  });
};

export const getBackendBaseUrl = (): string => BASE_URL;
