-- ============================================================
-- TradeLog India — Schema (with Soft Delete + Weekly Cleanup)
-- ============================================================
CREATE DATABASE IF NOT EXISTS tradelog_india;
USE tradelog_india;

-- ── Users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE,
    mobile          VARCHAR(15) UNIQUE,
    password        VARCHAR(255),
    broker          ENUM('ZERODHA','UPSTOX','ANGEL','OTHER','NONE') DEFAULT 'NONE',
    role            ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    status          ENUM('ACTIVE','BANNED','UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
    email_verified  BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    oauth_provider  VARCHAR(30),
    oauth_id        VARCHAR(100),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login      DATETIME,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      DATETIME DEFAULT NULL,
    INDEX idx_users_email      (email),
    INDEX idx_users_mobile     (mobile),
    INDEX idx_users_is_deleted (is_deleted)
);

-- ── OTP Tokens ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    identifier  VARCHAR(150) NOT NULL,
    otp_code    VARCHAR(6) NOT NULL,
    type        ENUM('EMAIL_VERIFY','MOBILE_VERIFY','LOGIN') NOT NULL,
    expires_at  DATETIME NOT NULL,
    used        BOOLEAN DEFAULT FALSE,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_otp_identifier (identifier),
    INDEX idx_otp_is_deleted (is_deleted)
);

-- ── Trades ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trades (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    trade_date  DATE NOT NULL,
    symbol      VARCHAR(50) NOT NULL,
    segment     ENUM('EQUITY','FO_OPTIONS','FO_FUTURES','CRYPTO') NOT NULL,
    side        ENUM('LONG','SHORT') NOT NULL,
    entry_price DECIMAL(12,2) NOT NULL,
    exit_price  DECIMAL(12,2) NOT NULL,
    quantity    DECIMAL(12,4) NOT NULL,
    stop_loss   DECIMAL(12,2),
    target      DECIMAL(12,2),
    gross_pnl   DECIMAL(12,2),
    net_pnl     DECIMAL(12,2),
    brokerage   DECIMAL(10,2) DEFAULT 0.00,
    setup       VARCHAR(50),
    emotion     VARCHAR(30),
    mistake_tags JSON,
    notes       TEXT,
    source      ENUM('MANUAL','ZERODHA','UPSTOX','ANGEL') DEFAULT 'MANUAL',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trades_user_id    (user_id),
    INDEX idx_trades_date       (trade_date),
    INDEX idx_trades_is_deleted (is_deleted)
);

-- ── Import Logs ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS import_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    broker      ENUM('ZERODHA','UPSTOX','ANGEL') NOT NULL,
    filename    VARCHAR(200),
    total_rows  INT,
    imported    INT,
    skipped     INT,
    imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_import_user_id   (user_id),
    INDEX idx_import_is_deleted (is_deleted)
);

-- ── Seed Admin ────────────────────────────────────────────
-- Password: Admin@123
INSERT IGNORE INTO users (name, email, password, broker, role, status, email_verified, mobile_verified)
VALUES ('Admin', 'admin@tradelog.in',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'NONE', 'ADMIN', 'ACTIVE', TRUE, TRUE);
