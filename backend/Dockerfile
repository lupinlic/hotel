FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip zip curl libzip-dev ca-certificates gnupg apt-transport-https \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && docker-php-ext-install pdo_mysql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader
RUN npm install
RUN npm run build || true

EXPOSE 8000

CMD ["bash", "-lc", "until bash -c 'cat < /dev/tcp/mysql/3306' 2>/dev/null; do echo 'Waiting for MySQL...'; sleep 2; done; php artisan migrate --force; php artisan serve --host=0.0.0.0 --port=8000"]
