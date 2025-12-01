# Dockerfile

# odlehčený Python image
FROM python:3.12-slim

# pracovní adresář uvnitř kontejneru
WORKDIR /code

# soubor se závislostmi
COPY ./requirements.txt .

# instalace závislosti
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# zbytek aplikace do kontejneru
COPY . .

RUN chmod +x /code/entrypoint.sh