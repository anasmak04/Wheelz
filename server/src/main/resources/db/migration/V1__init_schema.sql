CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(50),
                       last_name VARCHAR(50),
                       bio TEXT,
                       profile_image VARCHAR(255),
                       role VARCHAR(20) NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            slug VARCHAR(100) NOT NULL UNIQUE,
                            description TEXT,
                            parent_id BIGINT REFERENCES categories(id),
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(50) NOT NULL UNIQUE,
                      slug VARCHAR(50) NOT NULL UNIQUE,
                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
                       id BIGSERIAL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       slug VARCHAR(255) NOT NULL UNIQUE,
                       content TEXT NOT NULL,
                       excerpt TEXT,
                       featured_image VARCHAR(255),
                       status VARCHAR(20) NOT NULL,
                       user_id BIGINT NOT NULL REFERENCES users(id),
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       published_at TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_categories (
                                 post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
                                 category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                                 PRIMARY KEY (post_id, category_id)
);


CREATE TABLE post_tags (
                           post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
                           tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                           PRIMARY KEY (post_id, tag_id)
);


CREATE TABLE comments (
                          id BIGSERIAL PRIMARY KEY,
                          content TEXT NOT NULL,
                          post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
                          user_id BIGINT REFERENCES users(id),
                          parent_id BIGINT REFERENCES comments(id),
                          author_name VARCHAR(100),
                          author_email VARCHAR(100),
                          status VARCHAR(20) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
id BIGSERIAL PRIMARY KEY,
file_name VARCHAR(255) NOT NULL,
file_path VARCHAR(255) NOT NULL,
file_type VARCHAR(100),
file_size BIGINT,
alt_text VARCHAR(255),
caption TEXT,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_media_user_id ON media(user_id);