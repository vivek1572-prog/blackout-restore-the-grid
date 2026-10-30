"""create participants table

Revision ID: 0001_create_participants_table
Revises: 
Create Date: 2026-10-30 00:55:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_create_participants_table'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'participants',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.Column('college_id', sa.String(length=50), nullable=False),
        sa.Column('college_name', sa.String(length=150), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id', name='pk_participants'),
        sa.UniqueConstraint('college_id', name='uq_participants_college_id')
    )
    op.create_index('idx_participants_college_id', 'participants', ['college_id'], unique=True)


def downgrade() -> None:
    op.drop_index('idx_participants_college_id', table_name='participants')
    op.drop_table('participants')
