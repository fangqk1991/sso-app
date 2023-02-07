CREATE DATABASE `demo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE demo_db;

DROP TABLE IF EXISTS fc_account_carrier_extras;
DROP TABLE IF EXISTS fc_account_carrier;
DROP TABLE IF EXISTS fc_account;

CREATE TABLE IF NOT EXISTS fc_account
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    account_uid CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '账号 UUID，具备唯一性',
    password    VARCHAR(64)     NOT NULL COLLATE ascii_bin DEFAULT '' COMMENT 'bcrypt.hash(password, salt)',
    is_enabled  TINYINT         NOT NULL                   DEFAULT 1 COMMENT '是否可用',
    nick_name   VARCHAR(64)     NOT NULL                   DEFAULT '' COMMENT '昵称',
    register_ip VARCHAR(64)     NOT NULL                   DEFAULT '' COMMENT '注册 IP 地址',
    create_time TIMESTAMP       NOT NULL                   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL                   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (account_uid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_account_carrier
(
    _rid         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    carrier_uid  VARCHAR(64)     NOT NULL COMMENT '载体 ID',
    carrier_type VARCHAR(16)     NOT NULL COLLATE ascii_bin COMMENT '账号载体（登录方式）',
    account_uid  CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '账号 UUID，-> fc_account.account_uid',
    FOREIGN KEY (account_uid) REFERENCES fc_account (account_uid)
        ON DELETE RESTRICT,
    create_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (carrier_uid, carrier_type),
    UNIQUE (carrier_type, account_uid),
    INDEX (carrier_type)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_account_carrier_extras
(
    _rid         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    carrier_uid  VARCHAR(64)     NOT NULL COMMENT '载体 ID',
    carrier_type VARCHAR(16)     NOT NULL COLLATE ascii_bin COMMENT '账号载体（登录方式）',
    extras_info  MEDIUMTEXT COMMENT '附加信息',
    create_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (carrier_uid, carrier_type)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS fc_group_member;
DROP TABLE IF EXISTS fc_group_permission;
DROP TABLE IF EXISTS fc_group_access;
DROP TABLE IF EXISTS fc_group;
DROP TABLE IF EXISTS fc_app_access;
DROP TABLE IF EXISTS fc_app;

CREATE TABLE IF NOT EXISTS fc_app
(
    _rid            BIGINT UNSIGNED       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appid           VARCHAR(32)           NOT NULL COLLATE ascii_bin COMMENT '应用 appid',
    app_type        ENUM ('Admin','Open') NOT NULL DEFAULT 'Admin' COMMENT '应用类型',
    name            VARCHAR(127)          NOT NULL DEFAULT '' COMMENT '应用名',
    remarks         VARCHAR(255)          NOT NULL DEFAULT '' COMMENT '备注',
    config_info     MEDIUMTEXT COMMENT '配置信息，空 | JSON 字符串',
    permission_info MEDIUMTEXT COMMENT '权限定义，空 | JSON 字符串',
    power_users     TEXT COMMENT '具备操作权的用户，以 , 分隔',
    version         BIGINT                NOT NULL DEFAULT 0 COMMENT '版本号',
    author          VARCHAR(127)          NOT NULL DEFAULT '' COMMENT '创建者',
    create_time     TIMESTAMP             NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     TIMESTAMP             NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (appid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_app_access
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    access_id   CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '访问信息 ID，具备唯一性',
    appid       VARCHAR(32)     NOT NULL COLLATE ascii_bin COMMENT 'appid，SQL 外键 -> fc_app.appid',
    FOREIGN KEY (appid) REFERENCES fc_app (appid) ON DELETE CASCADE,
    app_secret  VARCHAR(64)     NOT NULL DEFAULT '' COMMENT '应用密钥',
    author      VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '创建者',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (access_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_group
(
    _rid             BIGINT UNSIGNED              NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id         CHAR(32)                     NOT NULL COLLATE ascii_bin COMMENT '组 ID，具备唯一性',
    appid            VARCHAR(32)                  NOT NULL COLLATE ascii_bin COMMENT 'appid，SQL 外键 -> fc_app.appid',
    FOREIGN KEY (appid) REFERENCES fc_app (appid) ON DELETE CASCADE,
    group_alias      VARCHAR(64)                  NOT NULL COLLATE ascii_bin COMMENT '组的别名，由用户自行指定，具备唯一性',
    name             VARCHAR(127)                 NOT NULL DEFAULT '' COMMENT '组名',
    remarks          VARCHAR(255)                 NOT NULL DEFAULT '' COMMENT '备注',
    version          BIGINT                       NOT NULL DEFAULT 0 COMMENT '版本号',
    author           VARCHAR(127)                 NOT NULL DEFAULT '' COMMENT '创建者',
    is_retained      TINYINT                      NOT NULL DEFAULT 0 COMMENT '是否为系统预留组（不可删除）',
    is_enabled       TINYINT                      NOT NULL DEFAULT 1 COMMENT '是否有效',
    black_permission TINYINT                      NOT NULL DEFAULT 0 COMMENT '所选的权限项列表为黑名单',
    sub_groups_str   MEDIUMTEXT COLLATE ascii_bin NULL COMMENT '子组 ID 列表，使用 , 分割',
    create_time      TIMESTAMP                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time      TIMESTAMP                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id),
    UNIQUE (appid, group_alias),
    INDEX (is_enabled)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_group_access
(
    _rid         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    access_id    CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '访问信息 ID，具备唯一性',
    group_id     CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'group_id，SQL 外键 -> fc_group.group_id',
    FOREIGN KEY (group_id) REFERENCES fc_group (group_id) ON DELETE CASCADE,
    group_secret VARCHAR(64)     NOT NULL DEFAULT '' COMMENT '组密钥',
    author       VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '创建者',
    create_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (access_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_group_member
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id    CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '组 ID，SQL 外键 -> fc_group.group_id',
    FOREIGN KEY (group_id) REFERENCES fc_group (group_id) ON DELETE CASCADE,
    member      VARCHAR(32)     NOT NULL COLLATE ascii_bin COMMENT '用户唯一标识；(group_id, member) 具备唯一性',
    is_admin    TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为管理员',
    author      VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '创建者',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id, member),
    INDEX (member)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_group_permission
(
    _rid           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id       CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '组 ID，SQL 外键 -> fc_group.group_id',
    FOREIGN KEY (group_id) REFERENCES fc_group (group_id) ON DELETE CASCADE,
    permission_key VARCHAR(127)    NOT NULL COMMENT '权限描述项 | *',
    author         VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '创建者',
    create_time    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id, permission_key),
    INDEX (permission_key)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
