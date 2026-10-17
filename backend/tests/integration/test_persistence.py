from decimal import Decimal
from pathlib import Path

from alembic.config import Config
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session

from alembic import command
from backend.repositories.transaction_repository import TransactionRepository
from backend.schemas.transaction import TransactionCreate, TransactionPatch
from backend.services.transaction_service import TransactionService


def test_data_survives_new_engine_and_session(tmp_path: Path) -> None:
    url = f"sqlite:///{tmp_path / 'persistent.db'}"
    config = Config(str(Path(__file__).resolve().parents[2] / "alembic.ini"))
    config.attributes["database_url"] = url
    command.upgrade(config, "head")

    engine = create_engine(url)
    with Session(engine) as session:
        service = TransactionService(TransactionRepository(session))
        transaction = service.create(
            TransactionCreate(description="Mercado", amount="80.00", type="expense")
        )
        transaction_id = transaction.id
    engine.dispose()

    engine = create_engine(url)
    with Session(engine) as session:
        service = TransactionService(TransactionRepository(session))
        assert service.get(transaction_id).amount == Decimal("80.00")
        service.update(transaction_id, TransactionPatch(amount="95.00"))
    engine.dispose()

    engine = create_engine(url)
    with Session(engine) as session:
        service = TransactionService(TransactionRepository(session))
        assert service.get(transaction_id).amount == Decimal("95.00")
        service.delete(transaction_id)
    engine.dispose()

    engine = create_engine(url)
    with Session(engine) as session:
        assert TransactionRepository(session).get(transaction_id) is None
    engine.dispose()

    command.downgrade(config, "base")
    engine = create_engine(url)
    assert "transactions" not in inspect(engine).get_table_names()
    engine.dispose()
    command.upgrade(config, "head")
    command.check(config)
