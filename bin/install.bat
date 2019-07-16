@echo off
set "d=%~dp0"
echo %d%
reg add "HKEY_CLASSES_ROOT\StartSerOneKey" /v "URL Protocol" /d "" /t REG_SZ /f
reg add "HKEY_CLASSES_ROOT\StartSerOneKey\DefaultIcon" /d "%d%startOneKey.exe" /t REG_SZ /f
reg add "HKEY_CLASSES_ROOT\StartSerOneKey\shell\open\command" /d "%d%startOneKey.exe ""%%1""" /t REG_SZ /f
reg add "HKEY_CLASSES_ROOT\StartSerOneKey\shell\open\command" /v "ppath" /d %d% /t REG_SZ /f
