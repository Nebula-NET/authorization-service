#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied, please pass 1 or 2 or ... for image tag"
    exit
fi

npm run build

export IMAGE_NAME=nebula/authorization-service:$1
docker build . --no-cache -t $IMAGE_NAME
docker tag $IMAGE_NAME repository.nebulanet.ir/$IMAGE_NAME
#docker push repository.nebulanet.ir/$IMAGE_NAME
#CREATE DATABASE $APP_DB_NAME;