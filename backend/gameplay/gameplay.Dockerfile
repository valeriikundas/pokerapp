FROM python:3.8.1-alpine
WORKDIR /gameplay
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "start_server.py"]