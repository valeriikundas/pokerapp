FROM python:3.8.0-alpine
WORKDIR /backend

RUN apk add --no-cache gcc musl-dev linux-headers curl libffi-dev openssl-dev python3-dev
RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev
# python3 -m pip install -r requirements.txt --no-cache-dir && \
# apk --purge del .build-deps

RUN pip install --upgrade pip
RUN pip install poetry

COPY pyproject.toml pyproject.toml
RUN poetry install

COPY . .

CMD ["poetry", "run", "python", "backend.py"]