FROM node:22

WORKDIR /app

# Zkopíruj obě složky – knihovnu i sandbox
COPY js ./js
COPY sandbox ./sandbox

# Nainstaluj závislosti knihovny
RUN cd js && npm install

# Spusť test
CMD ["node", "sandbox/test.js"]