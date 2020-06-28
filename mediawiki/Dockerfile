# https://github.com/chiefy/docker-mediawiki/blob/master/Dockerfile
# https://github.com/divinenephron/docker-mediawiki
FROM alpine:latest
ARG MW_VERSION
ARG MW_PATCH_VERSION

# Install PHP
RUN apk add --no-cache \
	php7 \
	php7-curl \
	php7-xml \
	php7-fpm \
	php7-ctype \
	php7-gd \
	php7-json \
	php7-mysqli \
	php7-pdo_mysql \
	php7-dom \
	php7-openssl \
	php7-iconv \
	php7-opcache \
	php7-intl \
	php7-mcrypt \
	php7-common \
	php7-xmlreader \
	php7-phar \
	php7-mbstring \
	php7-session \
	php7-fileinfo \
	diffutils \
	git \
	&& apk add --no-cache --virtual=.build-dependencies wget ca-certificates \
  && apk add nano \
  && apk add bash

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	# && php -r "if (hash_file('SHA384', 'composer-setup.php') === \"${COMPOSER_HASH}\") { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
	&& php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
	&& php -r "unlink('composer-setup.php');"

# PHP settings and system tweaks
RUN sed -i \
	-e "s,expose_php = On,expose_php = Off,g" \
	-e "s,;cgi.fix_pathinfo=1,cgi.fix_pathinfo=0,g" \
	-e "s,post_max_size = 8M,post_max_size = 100M,g" \
	-e "s,upload_max_filesize = 2M,upload_max_filesize = 100M,g" \
	/etc/php7/php.ini \
	&& sed -i \
	-e "s,;daemonize = yes,daemonize = no,g" \
	-e "s,user = nobody,user = www,g" \
	-e "s,;chdir = /var/www,chdir = /var/www/html,g" \
	-e "s,;listen.owner = nobody,listen.owner = www,g" \
	-e "s,;listen.group = nobody,listen.group = www,g" \
	-e "s,listen = 127.0.0.1:9000,listen = 0.0.0.0:9000,g" \
	-e "s,;clear_env = no,clear_env = no,g" \
	/etc/php7/php-fpm.d/www.conf \
	# forward logs to docker log collector
	&& ln -sf /dev/stderr /var/log/php7/error.log \
	&& mkdir -p /var/www

# Install MediaWiki
RUN cd /tmp \
	&& wget -nv https://releases.wikimedia.org/mediawiki/1.34/mediawiki-1.34.1.tar.gz \
	&& tar -C /var/www -xzf ./mediawiki*.tar.gz \
  && mv /var/www/mediawiki* /var/www/html \
	&& rm -rf /tmp/mediawiki* \
	&& adduser -S -D -H www \
	&& chown -R www /var/www/html \
	&& apk del .build-dependencies \
	&& cd /var/www/html
  #\
	#&& composer update --no-dev

COPY ./setup/extensions.sh /tmp/setup/extensions.sh
RUN bash -c "/tmp/setup/extensions.sh"

COPY ./setup/setup_database.sh /tmp/setup/setup_database.sh
RUN bash -c "/tmp/setup/setup_database.sh"

#RUN echo "<?php require_once('/var/www/ylhyra/settings/index.php');" >> /var/www/html/LocalSettings.php
RUN echo "require_once('/var/www/ylhyra/settings/index.php');" >> /var/www/html/LocalSettings.php

USER www
WORKDIR /var/www/html
EXPOSE 9000
ENTRYPOINT ["php-fpm7", "-F"]
