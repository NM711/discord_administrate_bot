CREATE TABLE blacklisted_words(
  word_id BIGSERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  user_id BIGINT REFERENCES users (id),
  server_id BIGINT REFERENCES registered_servers (server_id)
);

CREATE TABLE users(
  id BIGSERIAL PRIMARY KEY,
  UNIQUE(id),
  username TEXT NOT NULL
);

CREATE TABLE registered_servers(
  server_id BIGSERIAL PRIMARY KEY
);

CREATE TABLE user_servers(
  user_id BIGINT REFERENCES users (id),
  server_id BIGINT REFERENCES registered_servers (server_id),
  PRIMARY KEY (user_id, server_id)
);

CREATE TABLE warned_id(
  warnedUser_id BIGSERIAL PRIMARY KEY
);

CREATE TABLE warned_in_servers(
  warnedUser_id BIGINT REFERENCES warned_id (warnedUser_id),
  serverId BIGINT REFERENCES registered_servers (server_id),
  warn_num INTEGER
);
