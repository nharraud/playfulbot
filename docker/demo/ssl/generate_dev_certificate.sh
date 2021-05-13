#!/bin/sh
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout ca.key -out ca.pem -subj "/C=US/CN=Example-Root-CA"
openssl x509 -outform pem -in ca.pem -out ca.crt
openssl req -new -nodes -newkey rsa:2048 -keyout ssl.key -out ssl.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in ssl.csr -CA ca.pem -CAkey ca.key -CAcreateserial -extfile domains.ext -out ssl.crt
