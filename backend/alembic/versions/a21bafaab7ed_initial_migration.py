"""initial migration

Revision ID: a21bafaab7ed
Revises: 
Create Date: 2024-12-12 11:52:01.642292

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a21bafaab7ed'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_movies_genre', table_name='movies')
    op.drop_index('ix_movies_id', table_name='movies')
    op.drop_index('ix_movies_title', table_name='movies')
    op.drop_index('ix_movies_year', table_name='movies')
    op.drop_table('movies')
    op.drop_index('ix_movie_of_the_day_date', table_name='movie_of_the_day')
    op.drop_index('ix_movie_of_the_day_id', table_name='movie_of_the_day')
    op.drop_table('movie_of_the_day')
    op.drop_index('ix_lists_id', table_name='lists')
    op.drop_index('ix_lists_name', table_name='lists')
    op.drop_table('lists')
    op.drop_index('ix_settings_id', table_name='settings')
    op.drop_table('settings')
    op.drop_index('ix_genres_id', table_name='genres')
    op.drop_index('ix_genres_name', table_name='genres')
    op.drop_table('genres')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('genres',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_genres_name', 'genres', ['name'], unique=1)
    op.create_index('ix_genres_id', 'genres', ['id'], unique=False)
    op.create_table('settings',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('list_count', sa.INTEGER(), nullable=True),
    sa.Column('list1_name', sa.VARCHAR(), nullable=True),
    sa.Column('list2_name', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_settings_id', 'settings', ['id'], unique=False)
    op.create_table('lists',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_lists_name', 'lists', ['name'], unique=False)
    op.create_index('ix_lists_id', 'lists', ['id'], unique=False)
    op.create_table('movie_of_the_day',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('date', sa.DATE(), nullable=True),
    sa.Column('movie_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_movie_of_the_day_id', 'movie_of_the_day', ['id'], unique=False)
    op.create_index('ix_movie_of_the_day_date', 'movie_of_the_day', ['date'], unique=1)
    op.create_table('movies',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('title', sa.VARCHAR(), nullable=True),
    sa.Column('year', sa.INTEGER(), nullable=True),
    sa.Column('genre', sa.VARCHAR(), nullable=True),
    sa.Column('watched', sa.BOOLEAN(), nullable=True),
    sa.Column('list_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['list_id'], ['lists.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_movies_year', 'movies', ['year'], unique=False)
    op.create_index('ix_movies_title', 'movies', ['title'], unique=False)
    op.create_index('ix_movies_id', 'movies', ['id'], unique=False)
    op.create_index('ix_movies_genre', 'movies', ['genre'], unique=False)
    # ### end Alembic commands ###
