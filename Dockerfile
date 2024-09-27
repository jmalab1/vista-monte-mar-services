FROM nginx

RUN apt -y update \
    && apt -y install \
        vim \
        sudo

COPY src /app
COPY conf /etc/nginx/conf.d

COPY certs/certificate.pem /etc/ssl/certs/certificate.pem
COPY certs/privatekey.pem /etc/ssl/private/privatekey.pem