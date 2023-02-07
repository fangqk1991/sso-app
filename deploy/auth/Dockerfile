########################################
FROM node:19-alpine AS FILES_CACHE

# /data/source-files: 构建所需的完整源代码
# /data/meta-files 相关的内容变更频率低，可大幅提升构建过程的缓存命中率
WORKDIR /data/source-files
COPY . .

# /data/meta-files 仅包含 package.json、pnpm-lock.yaml、pnpm-workspace.yaml、.npmrc
RUN mkdir -p /data/meta-files \
    && find . -not -path "*/node_modules/*" -name "package.json" \
      | xargs -i dirname {} \
      | xargs -i sh -c "mkdir -p /data/meta-files/{} && cp {}/package.json /data/meta-files/{}" \
    && cp /data/source-files/pnpm-lock.yaml \
          /data/source-files/.npmrc \
          /data/source-files/pnpm-workspace.yaml \
          /data/meta-files

# 格式化 package.json
RUN node ./deploy/deps/purify-package-json.js /data/meta-files

####### FILES_CACHE 阶段个性化代码 START ######
## 复制本次构建项目的 package.json 到 /data/prod-meta-files
#RUN cp -r /data/meta-files/packages/auth-backend /data/meta-files/packages/auth-frontend /data/prod-meta-files/packages
## 移除 /data/source-files/packages 与本次构建无关的 packages 目录其他工程
#RUN find /data/source-files/packages \! -name "auth-*" -mindepth 1 -maxdepth 1 -print | xargs rm -rf
## 移除 /data/source-files/deploy 下与本次构建无关的文件
#RUN find /data/source-files/deploy \! -name "*deps*" \! -name "auth" -mindepth 1 -maxdepth 1 -print | xargs rm -rf
#RUN find /data/source-files/deploy/auth \! -name "deps" -mindepth 1 -maxdepth 1 -print | xargs rm -rf
####### FILES_CACHE 阶段个性化代码 END ######

########################################
# 准备仅包含 package.json 和 yarn.lock 的最小构建依赖文件
# package.json 以外的文件修改将不会影响缓存命中
FROM node:19-alpine AS MODULES_CACHE

ARG BUILD_DIR=/data/build

WORKDIR ${BUILD_DIR}

RUN yarn global add pnpm

COPY --from=FILES_CACHE /data/meta-files/pnpm-lock.yaml ${BUILD_DIR}/pnpm-lock.yaml
RUN pnpm fetch

# 本仓库所有项目共享 pnpm install 缓存
COPY --from=FILES_CACHE /data/meta-files ${BUILD_DIR}
RUN pnpm install -r --offline

# node_modules 已准备完毕；此时复制完整源代码
COPY --from=FILES_CACHE /data/source-files ${BUILD_DIR}

# 将 docker.deps.local/ 目录下的文件复制到 docker.deps/
# docker.deps 中含有上传下载所需的配置文件，故需要在 yarn build 前复制
RUN cp -r ./deploy/docker.deps.local/* ./deploy/docker.deps/

# 下载依赖文件（适用于个别项目）
#RUN npx ali-oss-download ./deploy/docker.deps/web-oss.oss.config.js \
#  auth/something.txt ${BUILD_DIR}/my-modules/something.txt

RUN pnpm build
RUN rm -rf ./node_modules/ && pnpm install -r --offline --prod

########################################
# 最终镜像，仅复制可执行的程序文件和准备必要的系统服务（nginx、curl）
FROM node:19-alpine

# 其他项目若将本语句置于最前方，可共享缓存命中
RUN apk add --no-cache curl openssl nginx>=1.20.1 && yarn global add pm2 && pm2 install pm2-logrotate && mkdir -p /run/nginx/

LABEL maintainer="work@fangqk.com"
WORKDIR /data/auth

COPY --from=MODULES_CACHE /data/build .
COPY ./deploy/deps/*.sh /data/deps/

COPY ./deploy/auth/deps/docker.extras.config.js /data/auth/config/docker.extras.config.js
COPY ./deploy/auth/deps/auth.nginx.conf /etc/nginx/http.d/auth.nginx.conf

# 此步骤会使文件发生改变，应放在后方避免影响缓存命中
ARG commitSHA=Unknown
RUN sed -i 's/COMMIT_SHA/'${commitSHA}'/g' /etc/nginx/http.d/auth.nginx.conf
RUN sed -i 's/COMMIT_SHA/'${commitSHA}'/g' ./packages/auth-backend/ecosystem.config.js
RUN sed -i 's/COMMIT_SHA/'${commitSHA}'/g' ./packages/auth-frontend/dist/index.html
LABEL commitSHA="${commitSHA}"

CMD nginx && /data/deps/on-container-start.sh && pm2-runtime ./packages/auth-backend/ecosystem.config.js --env ${ENV}
#HEALTHCHECK CMD curl --fail http://localhost:2500/api/health/ping && curl --fail http://localhost:2699/api/health/ping || exit 1
