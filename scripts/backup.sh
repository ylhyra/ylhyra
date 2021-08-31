mysqldump \
  -u example_user \
  -pexample_password \
  --column-statistics=0 \
  --skip-extended-insert \
  ylhyra \
  user_data payments analytics users \
  | gzip > backup.$(date +%F.%H-%M-%S).sql