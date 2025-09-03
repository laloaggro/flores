#!/bin/bash

# Deployment script for Arreglos Victoria Florería

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
  echo -e "${GREEN}[DEPLOY]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_message "Starting deployment process..."

# Verificar si hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
  print_warning "You have uncommitted changes. These will be included in the deployment."
  echo "Do you want to continue? (y/N)"
  read -r response
  if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    print_message "Deployment cancelled by user."
    exit 0
  fi
fi

# Verificar la rama actual
BRANCH=$(git branch --show-current)
print_message "Current branch: $BRANCH"

# Opciones para diferentes tipos de despliegue
if [ "$#" -eq 0 ]; then
  echo "Usage: ./deploy.sh [development|staging|production]"
  echo "  development - Deploy to development environment"
  echo "  staging - Deploy to staging environment"
  echo "  production - Deploy to production environment"
  exit 1
fi

ENVIRONMENT=$1

case $ENVIRONMENT in
  development)
    print_message "Deploying to development environment..."
    TARGET_BRANCH="development"
    ;;
  staging)
    print_message "Deploying to staging environment..."
    TARGET_BRANCH="staging"
    ;;
  production)
    print_message "Deploying to production environment..."
    TARGET_BRANCH="main"
    print_warning "This will deploy to production. Are you sure? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      print_message "Production deployment cancelled by user."
      exit 0
    fi
    ;;
  *)
    print_error "Invalid environment. Use: development, staging, or production"
    exit 1
    ;;
esac

# Cambiar a la rama objetivo si es necesario
if [ "$BRANCH" != "$TARGET_BRANCH" ]; then
  print_message "Switching to $TARGET_BRANCH branch"
  git checkout $TARGET_BRANCH
  
  if [ $? -ne 0 ]; then
    print_error "Failed to switch to $TARGET_BRANCH branch"
    exit 1
  fi
fi

# Hacer pull de los últimos cambios
print_message "Pulling latest changes..."
git pull origin $TARGET_BRANCH

if [ $? -ne 0 ]; then
  print_error "Failed to pull latest changes"
  exit 1
fi

# Agregar todos los cambios
print_message "Adding all changes..."
git add .

# Commit changes if there are any
print_message "Checking for changes..."
if ! git diff-index --quiet HEAD --; then
  print_message "Committing changes..."
  git commit -m "Automated deployment to $ENVIRONMENT environment - $(date)"
  
  if [ $? -ne 0 ]; then
    print_error "Failed to commit changes"
    exit 1
  fi
else
  print_message "No changes to commit"
fi

# Push a repositorio remoto
print_message "Pushing to remote repository..."
git push origin $TARGET_BRANCH

if [ $? -ne 0 ]; then
  print_error "Failed to push to remote repository"
  exit 1
fi

print_message "Deployment process completed successfully!"
print_message "Deployed to $ENVIRONMENT environment on branch $TARGET_BRANCH"

# Si es producción, mostrar mensaje adicional
if [ "$ENVIRONMENT" = "production" ]; then
  print_warning "Remember to check the production site to ensure everything is working correctly."
fi