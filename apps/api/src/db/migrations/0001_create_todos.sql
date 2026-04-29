create table if not exists todos (
  id text primary key,
  title text not null,
  completed integer not null default 0,
  created_at text not null
);

create index if not exists todos_created_at_idx on todos (created_at);
