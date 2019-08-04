-- https://dba.stackexchange.com/questions/68266/what-is-the-best-way-to-store-an-email-address-in-postgresql/165923#165923

CREATE DOMAIN email
  CHECK ( value ~ '^[\w.!#$%&''*+/=?^`{|}~-]+@[:alnum:](?:[[:alnum:]-]{0,61}[:alnum:])?(?:\.[:alnum:](?:[[:alnum:]-]{0,61}[:alnum:])?)*$' );
  -- CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[[a-zA-Z0-9]](?:[a-zA-Z0-9-]{0,61}[[a-zA-Z0-9]])?(?:\.[[a-zA-Z0-9]](?:[a-zA-Z0-9-]{0,61}[[a-zA-Z0-9]])?)*$' );


-- https://dba.stackexchange.com/questions/164796/how-do-i-store-phone-numbers-in-postgresql

CREATE EXTENSION pg_libphonenumber;

CREATE TYPE statement_status AS ENUM ('immediate', 'daily', 'weekly', 'biweekly', 'bimonthly', 'monthly');

CREATE TYPE account_status AS ENUM ('active', 'suspended');

CREATE TABLE IF NOT EXISTS accounts (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    location    INTEGER REFERENCES locations(id) NOT NULL,
    phone       phone_number,
    fax         phone_number,
    discount    SMALLINT NOT NULL DEFAULT 0 CHECK(discount <= 100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    balance 'money'  -- update by trigger on statements

    status      account_status NOT NULL,
    frequency   INTEGER NOT NULL DEFAULT 0

--  t.integer  "users_count",             default: 0
--  t.string   "ref_pattern"

)

CREATE TABLE users(
    id          SERIAL PRIMARY KEY,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    location    INTEGER REFERENCES locations(id) NOT NULL,
    phone       phone_number,
    fax         phone_number,
    account_id  INTEGER REFERENCES accounts(id),
    email       email NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

/****
t.integer  "role",                           default: 0
t.string   "state",                          default: "passive"
t.string   "crypted_password",                                   null: false
t.string   "password_salt",                                      null: false
t.string   "persistence_token",                                  null: false
t.string   "single_access_token",                                null: false
t.string   "perishable_token",                                   null: false
t.integer  "login_count",                    default: 0,         null: false
t.integer  "failed_login_count",             default: 0,         null: false
t.datetime "last_request_at"
t.datetime "current_login_at"
t.datetime "last_login_at"
t.string   "current_login_ip"
t.string   "last_login_ip"
t.datetime "created_at"
t.datetime "updated_at"

****/
)

CREATE TABLE drivers(
    id          SERIAL PRIMARY KEY
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    phone       phone_number NOT NULL,
    email       email NOT NULL
)

CREATE TABLE routes(
    id  SERIAL PRIMARY KEY
)

CREATE TABLE payroll(
    id  SERIAL PRIMARY KEY
)

CREATE TYPE statement_status AS ENUM ('mailed', 'received', 'payed');

CREATE TABLE IF NOT EXISTS statements (
    id          SERIAL PRIMARY KEY,

    account_id  INTEGER REFERENCES accounts(id) NOT NULL,
    amount 'money'.
    status      statement_status NOT NULL, -- seems redundant
    create_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_due    TIMESTAMPTZ NOT NULL,
    amount_due 'money' NOT NULL  -- trigger on payment ??

)

CREATE TRIGGER AFTER INSERT ON statements FOR EACH ROW EXECUTE PROCEDURE adjust_balance(account_id, amount)

CREATE FUNCTION adjust_balance (accountno integer, amount numeric) $$
    UPDATE accounts
        SET balance = balance + amount
        WHERE id = adjust_balance.accountno
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS payments (
    account_id INTEGER REFERENCES accounts(id) NOT NULL,
    amount 'money' NOT NULL,
    balance 'money' NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

--    t.string  "reference"
--    t.string  "payment_type", default: "bogus", null: false
--    t.string  "safe_number"
--    t.string  "payer"
--    t.text    "params",       default: "",      null: false
)
CREATE TRIGGER AFTER INSERT ON payment
    FOR EACH ROW
    EXECUTE PROCEDURE adjust_balance(account_id, -amount)

CREATE TABLE IF NOT EXISTS allocations (
    a_amount    'money' NOT NULL, -- what type of check ????
    statement_id INTEGER REFERENCES statements(id) NOT NULL,
    payment_id   INTEGER REFERENCES payments(id) NOT NULL,
)

CREATE TYPE job_status AS ENUM ('submitted', 'dispatched', 'delivered','invoiced', 'canceled');

CREATE TABLE IF NOT EXISTS jobs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    account_id      INTEGER REFERENCES accounts(id),
    route_id        INTEGER REFERENCES routes(id),
    statement_id    INTEGER REFERENCES statements(id),

    ready           TIMESTAMPTZ NOT NULL,
    instructions    TEXT,
    notes           TEXT,

    attn            TEXT,
    attnPhone       phone_number,
    create_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    state           job_status NOT NULL DEFAULT 'submitted'
--    reference
/**
 * if we allow no account then capture
 * email, phone, cc authorization
 */
)

CREATE TABLE IF NOT EXISTS charge_types(
    id              SERIAL PRIMARY KEY,
    name            TEXT,
    amount          INTEGER
)

CREATE TABLE IF NOT EXISTS charges (
    id              SERIAL PRIMARY KEY,
    amount          NUMERIC(5,2) NOT NULL CHECK(amount >= 0),
    quantity        SMALLINT NOT NULL CHECK(quantity > 0),
    driver_id       INTEGER REFERENCES drivers(id),  -- can not do splits
    job_id          INTEGER REFERENCES jobs(id) NOT NULL,
    rate            SMALLINT NOT NULL DEFAULT 60 CHECK(rate BETWEEN 0 AND 100), -- maybe by driver
    payroll_id      INTEGER REFERENCES payrolls(id),
    kind            INTEGER REFERENCES charge_type(id)
)

CREATE TABLE IF NOT EXISTS locations (
    id          SERIAL PRIMARY KEY,
    name        TEXT,
    address     TEXT NOT NULL,
    verified    boolean NOT NULL DEFAULT false,
    latitude    float NOT NULL,
    longitude   float NOT NULL
)

CREATE TABLE IF NOT EXISTS stops (
    id          SERIAL PRIMARY KEY,
    location    INTEGER REFERENCES locations(id) NOT NULL,
    signed      TEXT,
    job_id      INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    route_id    INTEGER REFERENCES routes(id),
    delivery_due TIMESTAMPTZ NOT NULL,
    at          TIMESTAMPTZ,
    position    integer
)
CREATE TRIGGER
    AFTER UPDATE ON stops
    FOR EACH ROW
    WHEN OLD.at is NULL AND NEW.at IS NOT NULL
    EXECUTE PROCEDURE foo









/*
  create_table "invitations", force: :cascade do |t|
    t.string   "email",                            null: false
    t.string   "key"
    t.string   "status",       default: "pending", null: false
    t.integer  "company_id",                       null: false
    t.integer  "requestor_id",                     null: false
    t.datetime "expires",                          null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end


  create_table "p_stops", force: :cascade do |t|
    t.string  "name",            limit: 100
    t.string  "address",         limit: 100,               null: false
    t.string  "zip",             limit: 5,                 null: false
    t.float   "lat",                         default: 0.0, null: false
    t.float   "lon",                         default: 0.0, null: false
    t.integer "periodic_run_id"
    t.integer "position",                    default: 0
  end


  create_table "periodic_runs", force: :cascade do |t|
    t.integer  "company_id"
    t.integer  "user_id"
    t.integer  "user"
    t.boolean  "sun"
    t.boolean  "mon"
    t.boolean  "tue"
    t.boolean  "wed"
    t.boolean  "thu"
    t.boolean  "fri"
    t.boolean  "sat"
    t.datetime "ready"
    t.text     "instructions"
    t.string   "notes",        limit: 100
    t.string   "attn",         limit: 30
    t.string   "attnPhone",    limit: 30
    t.string   "reference",    limit: 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ref_numbers", force: :cascade do |t|
    t.string   "ref"
    t.date     "good_til"
    t.integer  "amount"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "company_id"
  end

end
*/