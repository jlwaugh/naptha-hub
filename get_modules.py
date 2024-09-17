import asyncio
from surrealdb import Surreal
import os
from dotenv import load_dotenv

async def main():
    load_dotenv()

    hub = Surreal("ws://node.naptha.ai:3001/rpc")
    await hub.connect()

    await hub.signin({
        "username": os.getenv("HUB_USER"),
        "password": os.getenv("HUB_PASS"),
        "SC": 'user',
        "DB": 'naptha',
        "NS": 'naptha',
    })

    modules = await hub.select("module")
    if modules:
        print(modules)
    else:
        print("modules not found")

if __name__ == "__main__":
    asyncio.run(main())
