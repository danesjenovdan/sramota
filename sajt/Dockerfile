FROM nginx:alpine

# copy built files from the 'build' container into the nginx container
COPY . /usr/share/nginx/html

# make files readable
RUN chmod -R 755 /usr/share/nginx/html/
