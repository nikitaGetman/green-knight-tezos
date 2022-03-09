FROM postgres:13.3 

COPY ./scripts/ /docker-entrypoint-initdb.d/

# ENV POSTGRES_DB="app_db"
# ENV POSTGRES_USER="admin"
# ENV POSTGRES_PASSWORD="admin"

ARG POSTGRES_DB="app_db"
ARG POSTGRES_USER="admin"
ARG POSTGRES_PASSWORD="admin"

EXPOSE 5432

RUN chmod a+r /docker-entrypoint-initdb.d/*
