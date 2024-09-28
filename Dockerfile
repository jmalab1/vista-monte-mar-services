FROM nginx    

RUN apt -y update \
    && apt -y install \
        vim \
        sudo \
        build-essential \
        curl \
        nodejs \
        npm \
        iproute2

COPY app /app

RUN rm -rf /etc/nginx/conf.d/*
COPY conf /etc/nginx/conf.d

RUN chmod +x /app/run.sh

ENTRYPOINT [ "/app/run.sh" ]