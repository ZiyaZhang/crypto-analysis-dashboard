import os
import sqlite3
from typing import Any, Dict, List

DATABASE_PATH = "transactions.db"


def init_database():
    """初始化数据库表结构"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            hash TEXT PRIMARY KEY,
            from_addr TEXT,
            to_addr TEXT,
            value TEXT,
            time INTEGER,
            raw_json TEXT,
            parsed_json TEXT
        )
    """
    )

    conn.commit()
    conn.close()
    print(f"数据库初始化完成: {DATABASE_PATH}")


def insert_transaction(tx_data: Dict[str, Any]):
    """插入单笔交易数据"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT OR REPLACE INTO transactions
        (hash, from_addr, to_addr, value, time, raw_json, parsed_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """,
        (
            tx_data.get("hash", ""),
            tx_data.get("from", ""),
            tx_data.get("to", ""),
            tx_data.get("value", ""),
            tx_data.get("timeStamp", 0),
            tx_data.get("raw_json", ""),
            tx_data.get("parsed_json", ""),
        ),
    )

    conn.commit()
    conn.close()


def get_recent_transactions(limit: int = 20) -> List[Dict[str, Any]]:
    """获取最近的交易记录"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM transactions
        ORDER BY time DESC
        LIMIT ?
    """,
        (limit,),
    )

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def get_transaction_count() -> int:
    """获取交易总数"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM transactions")
    count = cursor.fetchone()[0]
    conn.close()

    return count


if __name__ == "__main__":
    init_database()
    print(f"交易总数: {get_transaction_count()}")
