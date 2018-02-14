#!/bin/bash

set -ex
IMAGE_NAME="jincort/backend-portfolio"
TAG="${1}"
docker build -t ${IMAGE_NAME}:${TAG} -f Dockerfile.prod .
docker push ${IMAGE_NAME}:${TAG}
