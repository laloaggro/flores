/**
 * Pruebas unitarias para funciones de utilidad
 */

// Mock de localStorage
const mockLocalStorage = (() => {
    let store = {};
    
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Importar funciones a probar
// Nota: En un entorno real, estas funciones se importarían correctamente
// Para este ejemplo, definiremos versiones simplificadas

const isAuthenticated = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch (e) {
        localStorage.removeItem('token');
        return false;
    }
};

const getUserInfoFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.userId || payload.id,
            name: payload.name || payload.username || 'Usuario',
            email: payload.email || '',
            role: payload.role || 'user',
            picture: payload.picture || null
        };
    } catch (e) {
        console.error('Error al parsear el token:', e);
        localStorage.removeItem('token');
        return null;
    }
};

describe('Funciones de utilidad', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    
    describe('isAuthenticated', () => {
        it('debería devolver false si no hay token', () => {
            expect(isAuthenticated()).toBe(false);
        });
        
        it('debería devolver false si el token ha expirado', () => {
            const pastPayload = { exp: Date.now() / 1000 - 3600 };
            const token = btoa(JSON.stringify(pastPayload));
            localStorage.setItem('token', `header.${token}.signature`);
            
            expect(isAuthenticated()).toBe(false);
        });
        
        it('debería devolver true si el token es válido', () => {
            const futurePayload = { exp: Date.now() / 1000 + 3600 };
            const token = btoa(JSON.stringify(futurePayload));
            localStorage.setItem('token', `header.${token}.signature`);
            
            expect(isAuthenticated()).toBe(true);
        });
        
        it('debería eliminar el token si es inválido', () => {
            localStorage.setItem('token', 'token-invalido');
            
            expect(isAuthenticated()).toBe(false);
            expect(localStorage.getItem('token')).toBeNull();
        });
    });
    
    describe('getUserInfoFromToken', () => {
        it('debería devolver null si no hay token', () => {
            expect(getUserInfoFromToken()).toBeNull();
        });
        
        it('debería extraer la información del usuario del token', () => {
            const userData = {
                userId: '123',
                name: 'Usuario de prueba',
                email: 'usuario@prueba.com',
                role: 'admin'
            };
            const token = btoa(JSON.stringify(userData));
            localStorage.setItem('token', `header.${token}.signature`);
            
            const userInfo = getUserInfoFromToken();
            expect(userInfo).toEqual({
                id: '123',
                name: 'Usuario de prueba',
                email: 'usuario@prueba.com',
                role: 'admin',
                picture: null
            });
        });
        
        it('debería manejar tokens con diferentes estructuras', () => {
            const userData = {
                id: '123',
                username: 'usuario',
                email: 'usuario@prueba.com'
            };
            const token = btoa(JSON.stringify(userData));
            localStorage.setItem('token', `header.${token}.signature`);
            
            const userInfo = getUserInfoFromToken();
            expect(userInfo.name).toBe('usuario');
        });
    });
});