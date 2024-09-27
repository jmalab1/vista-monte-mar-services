FROM nginx    

RUN apt -y update \
    && apt -y install \
        vim \
        sudo \
        build-essential \
        curl \
        nodejs \
        npm

COPY app /app
COPY conf /etc/nginx/conf.d

COPY certs/certificate.pem /etc/ssl/certs/certificate.pem
COPY certs/privatekey.pem /etc/ssl/private/privatekey.pem

COPY run.sh /
RUN chmod +x /run.sh

ENTRYPOINT [ "/run.sh" ]