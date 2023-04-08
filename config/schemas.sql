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

INSERT INTO `fc_app` (`appid`, `app_type`, `name`, `remarks`, `config_info`, `permission_info`, `power_users`, `author`)
VALUES ('user-system', 'Admin', 'User System', '初始管理员为 *，表示所有人均具有最高权限，请及时移除', '{}',
        '{"permissionKey":"*","name":"所有权限","description":"所有权限","children":[]}', '*', '*')
ON DUPLICATE KEY UPDATE `appid` = VALUES(`appid`);

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
    _rid               BIGINT UNSIGNED                        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id           CHAR(32)                               NOT NULL COLLATE ascii_bin COMMENT '组 ID，具备唯一性',
    appid              VARCHAR(32)                            NOT NULL COLLATE ascii_bin COMMENT 'appid，SQL 外键 -> fc_app.appid',
    FOREIGN KEY (appid) REFERENCES fc_app (appid) ON DELETE CASCADE,
    group_alias        VARCHAR(64)                            NOT NULL COLLATE ascii_bin COMMENT '组的别名，由用户自行指定，具备唯一性',
    group_category     ENUM ('Custom', 'Department', 'Staff') NOT NULL DEFAULT 'Custom' COMMENT '组类别',
    department_id      VARCHAR(40)                            NULL COLLATE ascii_bin COMMENT '绑定部门 ID',
    is_full_department TINYINT                                NOT NULL DEFAULT 0 COMMENT '是否包含子孙部门',
    department_hash    CHAR(8) COLLATE ascii_bin              NOT NULL DEFAULT '' COMMENT '部门摘要值',
    name               VARCHAR(127)                           NOT NULL DEFAULT '' COMMENT '组名',
    remarks            VARCHAR(255)                           NOT NULL DEFAULT '' COMMENT '备注',
    version            BIGINT                                 NOT NULL DEFAULT 0 COMMENT '版本号',
    author             VARCHAR(127)                           NOT NULL DEFAULT '' COMMENT '创建者',
    is_retained        TINYINT                                NOT NULL DEFAULT 0 COMMENT '是否为系统预留组（不可删除）',
    is_enabled         TINYINT                                NOT NULL DEFAULT 1 COMMENT '是否有效',
    black_permission   TINYINT                                NOT NULL DEFAULT 0 COMMENT '所选的权限项列表为黑名单',
    sub_groups_str     MEDIUMTEXT COLLATE ascii_bin           NULL COMMENT '子组 ID 列表，使用 , 分割',
    create_time        TIMESTAMP                              NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time        TIMESTAMP                              NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
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


CREATE TABLE IF NOT EXISTS fc_feishu_department
(
    _rid                      BIGINT UNSIGNED           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    is_stash                  TINYINT                   NOT NULL DEFAULT '0' COMMENT '是否为数据副本',
    open_department_id        VARCHAR(40)               NOT NULL COLLATE ascii_bin COMMENT '飞书 open_department_id',
    department_id             VARCHAR(40)               NOT NULL COLLATE ascii_bin COMMENT '飞书 department_id',
    parent_open_department_id VARCHAR(40)               NOT NULL COLLATE ascii_bin COMMENT '父级 open_department_id',
    department_name           TEXT COMMENT '部门名称',
    path                      TEXT COLLATE ascii_bin COMMENT '完整路径',
    hash                      CHAR(8) COLLATE ascii_bin NOT NULL DEFAULT '' COMMENT 'MD5 摘要值',
    raw_data_str              MEDIUMTEXT COMMENT '原始信息',
    create_time               TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time               TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (is_stash, open_department_id),
    INDEX (is_stash),
    INDEX (open_department_id),
    INDEX (department_name(127)),
    INDEX (parent_open_department_id),
    INDEX (path(768))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_feishu_user
(
    _rid         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    union_id     VARCHAR(40)     NOT NULL COLLATE ascii_bin COMMENT '飞书 union_id',
    user_id      VARCHAR(40)     NOT NULL COLLATE ascii_bin COMMENT '飞书 user_id',
    open_id      VARCHAR(40)     NOT NULL COLLATE ascii_bin COMMENT '飞书 open_id',
    email        VARCHAR(127)    NOT NULL COMMENT '用户邮箱',
    name         VARCHAR(127)    NOT NULL DEFAULT '' COMMENT '企业微信姓名',
    is_valid     TINYINT         NOT NULL DEFAULT '0' COMMENT '是否活跃',
    raw_data_str MEDIUMTEXT COMMENT '原始信息',
    create_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (union_id),
    INDEX (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS fc_feishu_department_member
(
    _rid               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    is_stash           TINYINT         NOT NULL DEFAULT '0' COMMENT '是否为数据副本',
    open_department_id VARCHAR(40)     NOT NULL COLLATE ascii_bin COMMENT '飞书 open_department_id',
    union_id           VARCHAR(40)     NOT NULL COLLATE ascii_bin COMMENT '飞书 user_id',
    is_leader          TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为组长',
    create_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (is_stash, open_department_id) REFERENCES fc_feishu_department (is_stash, open_department_id) ON DELETE CASCADE ON UPDATE RESTRICT,
    UNIQUE (is_stash, open_department_id, union_id),
    INDEX (is_stash),
    INDEX (open_department_id),
    INDEX (union_id),
    INDEX (is_leader)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
