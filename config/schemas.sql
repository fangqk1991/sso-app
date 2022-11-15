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


CREATE TABLE IF NOT EXISTS fc_sso_client
(
    _rid                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id               VARCHAR(64)     NOT NULL COLLATE ascii_bin COMMENT 'Client ID，用户自定义（最好具备语义），具备唯一性',
    client_secret           VARCHAR(64)     NOT NULL COLLATE ascii_bin COMMENT 'Client Secret',
    name                    VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '应用名称',
    grants_str              TEXT COLLATE ascii_bin COMMENT 'grants, 以 , 分割',
    scopes_str              TEXT COLLATE ascii_bin COMMENT 'scopes, 以 , 分割',
    redirect_uris_str       TEXT COLLATE ascii_bin COMMENT 'redirectUris, 以 , 分割',
    access_token_life_time  INT             NOT NULL DEFAULT 7200 COMMENT 'accessTokenLifetime, 单位: 秒',
    refresh_token_life_time INT             NOT NULL DEFAULT 0 COMMENT 'refreshTokenLifetime, 单位: 秒',
    auto_granted            TINYINT         NOT NULL DEFAULT 0 COMMENT '无需用户点击，自动获得授权 (针对可信应用)',
    is_partner              TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为合作商',
    is_enabled              TINYINT         NOT NULL DEFAULT 0 COMMENT '是否可用',
    power_users_str         TEXT COLLATE ascii_bin COMMENT 'powerUsers, 以 , 分割',
    events_str              TEXT COLLATE ascii_bin COMMENT 'events, 以 , 分割',
    notify_url              TEXT COLLATE ascii_bin COMMENT '通知地址',
    create_time             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (client_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_user_auth
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id   VARCHAR(64)     NOT NULL COLLATE ascii_bin COMMENT 'Client ID，-> fc_sso_client.client_id',
    FOREIGN KEY (client_id) REFERENCES fc_sso_client (client_id)
        ON DELETE CASCADE,
    user_uid    VARCHAR(127)    NOT NULL COLLATE ascii_bin COMMENT '用户 ID',
    scopes_str  TEXT COLLATE ascii_bin COMMENT 'scopes, 以 , 分割',
    is_enabled  TINYINT         NOT NULL DEFAULT 0 COMMENT '是否可用',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (client_id, user_uid),
    INDEX (user_uid),
    INDEX (is_enabled)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
