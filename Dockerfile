FROM nginx
COPY dist /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf etc/nginx/conf.d/
ENTRYPOINT sh -c "./vite-envs.sh && nginx -g 'daemon off;'"
CMD ["nginx", "-g", "daemon off;"]