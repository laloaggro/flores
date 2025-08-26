const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Simular base de datos de usuarios en archivo
const usersFile = path.join(__dirname, 'users-test.json');

// Función para cargar usuarios
function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Función para guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Función para registrar usuario
async function registerUser(name, email, password) {
  console.log(`Registrando usuario: ${name} (${email})`);
  
  // Cargar usuarios existentes
  let users = loadUsers();
  
  // Verificar si el usuario ya existe
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }
  
  // Hashear contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Crear nuevo usuario
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // Guardar usuario
  users.push(newUser);
  saveUsers(users);
  
  console.log("Usuario registrado exitosamente");
  return newUser;
}

// Función para iniciar sesión
async function loginUser(email, password) {
  console.log(`Iniciando sesión para: ${email}`);
  
  // Cargar usuarios
  const users = loadUsers();
  
  // Buscar usuario
  const user = users.find(user => user.email === email);
  if (!user) {
    throw new Error("Credenciales inválidas");
  }
  
  // Verificar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Credenciales inválidas");
  }
  
  // Generar token JWT (simulación)
  const token = jwt.sign(
    { id: user.id, email: user.email },
    'test-secret-key',
    { expiresIn: '1h' }
  );
  
  console.log("Inicio de sesión exitoso");
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };
}

// Función para ejecutar pruebas de autenticación
async function runAuthTests() {
  console.log("Iniciando pruebas de autenticación...\n");
  
  try {
    // Prueba 1: Registro de usuario
    console.log("1. Prueba de registro de usuario");
    const newUser = await registerUser(
      "María González",
      "maria.gonzalez@example.com",
      "contraseña123"
    );
    console.log("✓ Registro exitoso\n");
    
    // Prueba 2: Intento de registro duplicado
    console.log("2. Prueba de registro duplicado");
    try {
      await registerUser(
        "María González",
        "maria.gonzalez@example.com",
        "otracontraseña"
      );
      console.log("✗ Error: Debería haber fallado el registro duplicado");
    } catch (error) {
      console.log("✓ Registro duplicado correctamente rechazado:", error.message);
    }
    
    // Prueba 3: Inicio de sesión correcto
    console.log("\n3. Prueba de inicio de sesión correcto");
    const loginResult = await loginUser(
      "maria.gonzalez@example.com",
      "contraseña123"
    );
    console.log("✓ Inicio de sesión exitoso");
    console.log(`  Token generado: ${loginResult.token.substring(0, 20)}...`);
    
    // Prueba 4: Inicio de sesión con credenciales incorrectas
    console.log("\n4. Prueba de inicio de sesión con credenciales incorrectas");
    try {
      await loginUser(
        "maria.gonzalez@example.com",
        "contraseña-incorrecta"
      );
      console.log("✗ Error: Debería haber fallado el inicio de sesión");
    } catch (error) {
      console.log("✓ Inicio de sesión fallido correctamente:", error.message);
    }
    
    console.log("\n✅ Todas las pruebas de autenticación completadas exitosamente.");
    
  } catch (error) {
    console.error("❌ Error en las pruebas de autenticación:", error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
runAuthTests();