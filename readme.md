run mongo localhost on 27017

Run docker:
    docker image build -t backend .
    docker run -p 8000:8000 -d backend