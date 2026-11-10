# KSB Backend

FastAPI backend for the Kindersachenbörse Goldegg software.

## Database migrations (Alembic)

The database schema is only changed through migrations in `migrations/versions/`.
Alembic reads `DATABASE_URL` from `.env` (see `.env.example`), so start postgres first:

```
docker compose up -d
```

Commands (run in the project root):

```
# apply all migrations (do this after every pull)
uv run alembic upgrade head

# which version is the database on right now?
uv run alembic current

# changed a model? let Alembic write the migration, then READ it before you commit it
uv run alembic revision --autogenerate -m "add seller table"

# undo the last migration
uv run alembic downgrade -1
```

New models must be imported in `src/app/models/__init__.py`,
otherwise autogenerate doesn't see them.
