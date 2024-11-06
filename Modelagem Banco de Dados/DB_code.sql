CREATE TABLE ACCOUNTS (
    ID INTEGER NOT NULL PRIMARY KEY, 
    EMAIL VARCHAR2(500) NOT NULL UNIQUE, 
    PASSWORD VARCHAR2(64) NOT NULL, 
    COMPLETE_NAME VARCHAR2(500) NOT NULL,
    ACCOUNT_ROLE VARCHAR2(5) NOT NULL, 
    TOKEN VARCHAR2(32) NOT NULL
);

CREATE TABLE CATEGORY(
    CATEGORY_ID INTEGER NOT NULL PRIMARY KEY,
    NAME VARCHAR2(20) NOT NULL
);

CREATE TABLE EVENTS(
    EVENT_ID INTEGER NOT NULL PRIMARY KEY,
    CREATOR_ID INTEGER NOT NULL,
    TITLE VARCHAR2(50) NOT NULL,
    DESCRIPTION VARCHAR2(150) NOT NULL,
    CATEGORY INTEGER NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK(STATUS IN('Pending', 'Approved', 'Reproved', 'Deleted', 'Closed')),
    RIGHT_RESPONSE VARCHAR2(5) CHECK(RIGHT_RESPONSE IN('sim', 'não')),
    EVENT_DATE DATE NOT NULL,
    START_DATE DATE NOT NULL,
    END_DATE DATE NOT NULL,
    FOREIGN KEY(CREATOR_ID) REFERENCES ACCOUNTS(ID),
    FOREIGN KEY(CATEGORY) REFERENCES CATEGORY(CATEGORY_ID)
);

CREATE TABLE BANK_ACCOUNT(
    BANK_ID INTEGER NOT NULL PRIMARY KEY,
    ACCOUNT_NUMBER NUMBER(7) UNIQUE NOT NULL,
    BANK_NUMBER NUMBER(3) NOT NULL,
    AGENCY NUMBER(4) NOT NULL
);

CREATE TABLE PIX(
    PIX_ID INTEGER NOT NULL PRIMARY KEY,
    KEY VARCHAR2(50) UNIQUE NOT NULL
);

CREATE TABLE CREDIT_CARD(
    CARD_ID INTEGER NOT NULL PRIMARY KEY,
    CARD_NUMBER NUMBER(16) UNIQUE NOT NULL,
    CARD_NAME VARCHAR2(30) NOT NULL,
    CVC NUMBER(3) NOT NULL,
    EXPIRATION_DATE DATE NOT NULL
);

CREATE TABLE WALLET(
    ACCOUNT_ID INTEGER NOT NULL PRIMARY KEY,
    BALANCE NUMBER(*,2) NOT NULL CHECK(BALANCE >= 0),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ID)
);

CREATE TABLE WITHDRAWALS(
    WITHDRAWAL_ID INTEGER NOT NULL PRIMARY KEY,
    ACCOUNT_ID INTEGER NOT NULL,
    VALUE NUMBER(*,2) NOT NULL CHECK(VALUE > 0),
    WITHDRAWAL_TAX NUMBER(*,2) NOT NULL CHECK(WITHDRAWAL_TAX >= 0),
    WITHDRAWAL_DATE DATE NOT NULL,
    BANK_ID INTEGER,
    PIX_ID INTEGER,
    FOREIGN KEY (ACCOUNT_ID) REFERENCES WALLET(ACCOUNT_ID),
    FOREIGN KEY (PIX_ID) REFERENCES PIX(PIX_ID),
    FOREIGN KEY (BANK_ID) REFERENCES BANK_ACCOUNT(BANK_ID),
    CONSTRAINT chk_pix_or_bank CHECK (
        (PIX_ID IS NOT NULL AND BANK_ID IS NULL)
        OR
        (PIX_ID IS NULL AND BANK_ID IS NOT NULL)
    )
    
);

CREATE TABLE DEPOSITS(
    DEPOSIT_ID INTEGER NOT NULL PRIMARY KEY,
    ACCOUNT_ID INTEGER NOT NULL,
    VALUE NUMBER(*,2) NOT NULL CHECK(VALUE > 0),
    CARD_ID INTEGER NOT NULL,
    FOREIGN KEY (ACCOUNT_ID) REFERENCES WALLET(ACCOUNT_ID),
    FOREIGN KEY (CARD_ID) REFERENCES CREDIT_CARD(CARD_ID)
);

CREATE TABLE BETS(
    BET_ID INTEGER NOT NULL PRIMARY KEY,
    ACCOUNT_ID INTEGER NOT NULL,
    EVENT_ID INTEGER NOT NULL,
    VALUE NUMBER(*,2) NOT NULL CHECK(VALUE > 0),
    BET_DATE DATE NOT NULL, 
    BET_OPTION VARCHAR2(5) NOT NULL CHECK(BET_OPTION IN('sim', 'não')),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ID),
    FOREIGN KEY (EVENT_ID) REFERENCES EVENTS(EVENT_ID)
);

CREATE TABLE BET_WINNINGS(
    BET_ID INTEGER NOT NULL,
    ACCOUNT_ID INTEGER NOT NULL,
    VALUE NUMBER(*,2) NOT NULL CHECK(VALUE > 0),
    PRIMARY KEY(BET_ID, ACCOUNT_ID),
    FOREIGN KEY (BET_ID) REFERENCES BETS(BET_ID),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES WALLET(ACCOUNT_ID)
);

CREATE SEQUENCE SEQ_ACCOUNTS START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_EVENTS START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_CATEGORY START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_BANK START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_PIX START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_CARD START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_WITHDRAWAL START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_DEPOSIT START WITH 1
INCREMENT BY 1;

CREATE SEQUENCE SEQ_BET START WITH 1
INCREMENT BY 1;