# 👉 No build stage needed anymore (we'll build locally)

# Use NGINX to serve the static frontend files
FROM nginx:alpine

# Copy prebuilt dist folder into NGINX html directory
COPY dist /usr/share/nginx/html

# Optional: Copy a custom NGINX config if you want
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
