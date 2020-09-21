docker build -t ylhyra .
docker run -p 49160:8080 ylhyra

docker run ylhyra 





docker network create nginx-proxy



openssl req -x509 -out my-site.com.crt -keyout my-site.com.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
