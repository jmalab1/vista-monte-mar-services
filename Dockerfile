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

COPY app/dist /app/dist
COPY app/public /app/public

RUN rm -rf /etc/nginx/conf.d/*
COPY conf /etc/nginx/conf.d

COPY app/run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT [ "/app/run.sh" ]