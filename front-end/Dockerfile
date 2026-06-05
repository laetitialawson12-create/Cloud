FROM nginxinc/nginx-unprivileged:alpine

# Copier les fichiers statiques dans le répertoire de Nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# OpenShift écoute sur le port 8080 pour les conteneurs non-root
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]