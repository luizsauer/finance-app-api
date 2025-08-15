

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--create types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type transaction_type NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);