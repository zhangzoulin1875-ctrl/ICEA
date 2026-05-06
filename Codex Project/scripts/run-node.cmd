@echo off
setlocal

if exist "%ProgramFiles%\nodejs\node.exe" (
  set "NODE_BIN=%ProgramFiles%\nodejs\node.exe"
) else (
  set "NODE_BIN=node"
)

"%NODE_BIN%" %*
