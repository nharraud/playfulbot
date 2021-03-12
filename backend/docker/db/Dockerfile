FROM postgres:13

# COPY docker-entrypoint-initdb.d/*.sql /docker-entrypoint-initdb.d/
# COPY docker-entrypoint-initdb.d/*.sh /docker-entrypoint-initdb.d/
COPY postgresql.conf /etc/postgresql/postgresql.conf
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
