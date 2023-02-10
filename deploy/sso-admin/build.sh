#!/bin/bash

set -e
set -v on

__DIR__=`cd "$(dirname "$0")"; pwd`
ROOT_DIR="${__DIR__}/../.."
cd "${ROOT_DIR}"

imageName=fangcha.app/auth
containerName=my-auth
env=development
# 静态资源会根据 Refer 判断防盗链，本地环境不能正常访问，故传递参数构建特殊镜像
docker build -t ${imageName} -f "${__DIR__}/Dockerfile" . --build-arg useCDN=false

docker container stop ${containerName} || true
docker container rm ${containerName} || true

docker run --name ${containerName} --hostname=`hostname` -d \
  -p 2599:2599 \
  -e ENV=${env} \
  -e NODE_CONFIG_EXTRA_JS=/data/auth/config/docker.extras.config.js \
  ${imageName}
docker exec -it my-auth /bin/sh -c 'echo "#" >> /etc/hosts'

echo "You can visit <http://localhost:2599/> to check."
