"""Real MCP/stdio client for the official Blender Lab server (not a TCP shortcut).

Run with a Python environment containing the MCP SDK.
MCP_SERVER may override the configured local server executable.
Usage: python mcp_client.py [scene_script.py]
"""
import asyncio
import json
import os
from pathlib import Path
import sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    server = os.environ.get('MCP_SERVER', str(Path.home() / '.local/share/blender-lab-mcp/venv/bin/blender-mcp'))
    async with stdio_client(StdioServerParameters(command=server)) as (read, write):
        async with ClientSession(read, write) as session:
            info = await session.initialize()
            print('MCP initialized:', info.serverInfo.name, info.serverInfo.version)
            if len(sys.argv) > 1:
                code = 'PROJECT_ROOT = ' + repr(str(Path(__file__).resolve().parents[2])) + '\n' + Path(sys.argv[1]).read_text()
                response = await session.call_tool('execute_blender_code', {'code': code})
            else:
                response = await session.call_tool('get_blendfile_summary_datablocks', {})
            for item in response.content:
                if hasattr(item, 'text'):
                    print(item.text)
                    try:
                        payload = json.loads(item.text)
                    except ValueError:
                        continue
                    if isinstance(payload, dict) and payload.get('status') == 'error':
                        raise RuntimeError(payload)
            if response.isError:
                raise RuntimeError('MCP tool failed')


if __name__ == '__main__':
    asyncio.run(main())
